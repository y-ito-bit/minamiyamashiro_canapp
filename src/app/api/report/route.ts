import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { MINAMI_YAMASHIRO_CONTEXT } from '@/data/organizationData';

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-pro-latest',
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    try {
        const { messages, mbtiType, userName } = await req.json();
        const displayName = typeof userName === 'string' ? userName.trim() : '';
        const callName = displayName ? `${displayName}さん` : 'あなた';

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
        }

        const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');


        const prompt = `
あなたは、社会福祉法人 南山城学園のキャリアアドバイザー（現場を熟知した先輩視点）です。
5年目職員との対話から、彼らが学園の「7つの誓い」をどう体現しているか、そして将来どのキャリアパス（マネジメント/エキスパート/シニア）に向いているかを分析した【お仕事ポートフォリオ】を生成してください。

${MINAMI_YAMASHIRO_CONTEXT}

【ユーザー情報】
- 名前: ${displayName || '未入力'}
- 呼びかけ: ${callName}
- 業種: 社会福祉法人（介護・福祉）
- 経験年数: 5年目（中堅・リーダー層）
- MBTIタイプ: ${mbtiType}

# 対話ログ
${conversationText}

# 診断のルール
1. **経歴の多様性を肯定する**: スーパーローテーションで広い視点を得た人も、一つの現場を極めてきた人も、それぞれの「5年間の価値」を等しく称えてください。
2. **「7つの誓い」との紐付け**: 発掘したスキルが、学園の掲げる行動指針のどれに根ざしているかを明確にします。
3. **キャリアパスへの示唆**: 資質に基づき、学園内の3つのパス（マネジメント/エキスパート/シニア）のどこで最も輝けそうか、具体的な理由と共に伝えてください。
4. **自然な語りかけ**: AI特有の過剰な丁寧さや定型文を避け、現場の苦労を知る者としての温かみのある言葉で綴ってください。
5. **断定しない**: 対話でユーザーが肯定した強みのみを採用してください。否定された内容は強みとして扱わないでください。

# 診断・対話のゴール
            - ユーザーが「自分にはこんな力があるんだ」と再確認し、自分だけの【お仕事ポートフォリオ】を作成すること。
        - 嘘や誇張ではなく、日々の振る舞いの中にある「価値」を肯定すること。

# 対話の進め方とルール
        1. ** 共感と深掘り **: ユーザーの発言に対し「それは素晴らしい視点ですね」と共感しつつ、「その時、具体的にどんな風に声をかけたのですか？」と、事実（エピソード）を優しく引き出してください。
        2. ** 2つの視点でスキルを拾う **:
   - ** 実務・専門スキル **: 介護技術、記録の正確さ、関係機関との連携、制度の知識など。
   - ** 普遍・ソフトスキル **: 場の空気を作る力、変化に気づく力、感情のコントロール、同僚への配慮など。
        3. ** 納得感の確認 **: AIが勝手に決めつけず「今のエピソードからは、〇〇さんの『状況を察する力』が伝わってきましたが、ご自身でもそう感じますか？」と問いかけてください。
        4. ** レポート生成の提案 **:
        - スキル（実務と普遍の両面）が3つほど見えてきた段階で、以下の趣旨で提案してください。
   - **「〇〇さんの素敵な強みがいくつか見えてきましたね。ここらで一度、これまでの対話を『あなただけのポートフォリオ』として整理してみませんか？」**

# 出力レポート（JSON形式）
※ユーザーが「はい」と答えたら生成してください。
        {
            "focusArea": ["現場の支え手", "チームの調整役"など、福祉現場での役割名],
                "strengthMap": {
                "practical": "実務・専門的な確実さ (0-100)",
                    "empathy": "利用者・家族への共感力 (0-100)",
                        "collaboration": "仲間との連携・調整力 (0-100)",
                            "resilience": "心のしなやかさ (0-100)"
            },
            "message": "MBTIの個性を踏まえつつ、対話で見つかった『その人らしさ』を称えるメッセージ。冒頭で${callName}と呼びかけてください。200文字程度。ビジネス用語を避け、現場の情景が浮かぶ言葉を使ってください。",
                "identifiedSkills": [
                    {
                        "type": "実務 / 普遍",
                        "skillName": "（例）言葉にできないニーズを汲み取る、観察と傾聴の専門スキル",
                        "description": "対話から見えた具体的な行動事実をベースにした説明"
                    },
                    {
                        "type": "実務 / 普遍",
                        "skillName": "（例）多職種連携を円滑にする、情報の翻訳と橋渡しスキル",
                        "description": "専門的な情報をわかりやすく伝え、現場の混乱を防いでいる事実"
                    },
                    {
                        "type": "実務 / 普遍",
                        "skillName": "（例）多忙な時間帯でも優先順位を見極め、安全を確保する判断スキル",
                        "description": "慌ただしい現場で、何を優先すべきか瞬時に判断している事実"
                    }
                ]
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const json = JSON.parse(responseText);

        return NextResponse.json(json);

    } catch (error) {
        console.error('Report API Error:', error);

        // Return 503 Service Unavailable with the mock data as a fallback option
        // The frontend will handle this by showing an error message "API Limit Reached" 
        // and optionally displaying the mock data as a sample.
        const mockData = {
            focusArea: ["現場の守護神", "架け橋となる調整役"],
            strengthMap: {
                practical: 80,
                empathy: 95,
                collaboration: 90,
                resilience: 70
            },
            message: "（API制限等の理由により、サンプルレポートを表示しています）\n\nあなたの対話からは、利用者様一人ひとりの「声なき声」を拾い上げる深い共感と、それをチーム全体に共有してケアの質を高めようとする誠実さが伝わってきました。現場がどんなに忙しくても、あなたの存在があることで、利用者様もスタッフも安心できているはずです。",
            identifiedSkills: [
                {
                    type: "普遍",
                    skillName: "潜在的ニーズの言語化スキル",
                    description: "本人がうまく言葉にできない不安や要望を、表情やしぐさから読み取り、適切なケアにつなげている"
                },
                {
                    type: "実務",
                    skillName: "事故リスクの予兆検知力",
                    description: "ヒヤリハットの段階で小さな違和感に気づき、大事に至る前に環境を改善している"
                },
                {
                    type: "普遍",
                    skillName: "チームの心理的安全性醸成",
                    description: "後輩が失敗した際も、責めるのではなく「次はどうすればいいか」を一緒に考え、相談しやすい雰囲気を作っている"
                }
            ]
        };

        return NextResponse.json({
            error: "API_LIMIT_REACHED",
            message: "現在アクセスが集中しているか、API制限に達しました。",
            mockData: mockData
        }, { status: 503 });
    }
}
