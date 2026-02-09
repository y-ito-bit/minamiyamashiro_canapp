import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { MINAMI_YAMASHIRO_CONTEXT } from '@/data/organizationData';

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // The initial model declaration is not strictly needed if chatModel is immediately used.
    // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
        const { messages, mbtiType, userName } = await req.json();
        const displayName = typeof userName === 'string' ? userName.trim() : '';
        const callName = displayName ? `${displayName}さん` : 'あなた';

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
        }


        const systemPrompt = `
あなたは「社会福祉法人 南山城学園」の法人内キャリアコーチ（現場を熟知した先輩）です。
5年目職員のキャリア相談に乗り、彼らの強みを引き出します。

${MINAMI_YAMASHIRO_CONTEXT}

【ユーザー情報】
- 名前: ${displayName || '未入力'}
- 呼びかけ: ${callName}
- 業種: 社会福祉法人（介護・福祉）
- 経験年数: 5年目（中堅・リーダー層）
- MBTIタイプ: ${mbtiType}

【必ず守る前提】
1. スーパーローテーションの有無、所属事務所、職種は未確認。推測だけで断定しない。
2. 事業所名は本人が言った場合のみ使用。未確認なら一般表現にする。
3. 目的は「できることの深掘り」。キャリアパスや悩み相談はユーザーが出した時だけ扱う。

【会話の最初の流れ】
1. 最初に「あなたは5年間、どちらの事務所でどのような業務をしてきましたか？」と聞く。
2. 返答を要約し、断定せず確認する。
3. 所属事務所と職種が不明なら追加で聞く。

【判断ルール】
- 事務所が年ごとに変わっていれば「スーパーローテーション経験あり」と推測し、必ず確認する。
- 変化が見られなければ「未経験」と推測し、必ず確認する。
- 不明な場合は「不明」として確認する。

【深掘りのやり方】
- 述べられた業務から「できること・再現できる行動・強み」を2〜3個推測し、断定せずに問いかける。
- ユーザーが否定した項目は強みとして扱わない。
- 毎回1つずつ具体エピソードを聞く。

【話し方のルール】
1. 呼びかけは基本「${callName}」。
2. 1回の発言は100〜120文字程度。
3. 3〜4行に適度に改行する。
4. ビジネス用語禁止。現場の言葉（利用者様、ご家族、多職種連携、ケアの質、申し送り、ヒヤリハット等）を使う。
5. 定型的な褒めや要約は最小限にする。

【状態出力（必須）】
各返答の末尾に、次のJSONを必ず付ける。
出力形式は「:::STATE:::{...}」のみ。本文には含めない。
{
  "officeHistory": true/false,
  "role": true/false,
  "duties": true/false,
  "episode": true/false,
  "strengths": true/false,
  "episodeCount": 0-3,
  "strengthsCount": 0-3,
  "rotationStatus": "experienced" | "partial" | "none" | "unknown"
}
※本文の文字数（100〜120文字）はSTATE部分を除いて数える。
※episodeCount/strengthsCount は対話で確認できた件数の累計。最大3で固定。
`;


        // Convert messages for Gemini
        // Gemini roles: 'user' | 'model' (not 'assistant')
        // We also need to prepend System Prompt, or use systemInstruction if available in this SDK version (beta).
        // For safety, 'gemini-1.5-flash' usually supports systemInstruction in `getGenerativeModel`.
        // Let's re-init model with systemInstruction if supported, or just put it in history.
        // Simpler method: Add system prompt as the first part of the chat history or usage of systemInstruction param.
        // The SDK `getGenerativeModel` accepts `systemInstruction`.

        const chatModel = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            systemInstruction: systemPrompt
        });

        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        // Gemini API requirement: History must start with 'user' role.
        // Since we have a proactive AI that starts the conversation, the history might start with 'model'.
        if (history.length > 0 && history[0].role === 'model') {
            history.unshift({
                role: 'user',
                parts: [{ text: '（セッション開始）' }]
            });
        }

        const lastMessage = messages[messages.length - 1];

        const chat = chatModel.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessageStream(lastMessage.content);

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    if (chunkText) {
                        controller.enqueue(encoder.encode(chunkText));
                    }
                }
                controller.close();
            },
        });

        return new NextResponse(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
