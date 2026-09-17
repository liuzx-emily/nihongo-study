import type { StudySection } from '../types'

type TeachingContent = Pick<StudySection, 'vocabulary' | 'grammar'>

const teachingContent: TeachingContent[] = [
  {
    vocabulary: [
      { term: '立ち位置', reading: 'たちいち', meaning: '所处位置、角色定位', note: '本段指信长在争霸局势中的地位。' },
      { term: '異名', reading: 'いみょう', meaning: '别名、绰号', note: '能体现人物特征、事迹或评价的另一称号。' },
      { term: '風雲児', reading: 'ふううんじ', meaning: '风云人物', note: '指顺应动荡时代并推动巨大变化的人。' },
      { term: 'もたらす', meaning: '带来、造成', note: '本段指信长把新观念带到日本。' },
    ],
    grammar: [
      { pattern: '～なんて思われていなかった', meaning: '当时根本没人认为会……；「なんて」突出出乎预料', example: '絶対優勝するなんて思われていなかった。' },
    ],
  },
  {
    vocabulary: [
      { term: '密教', reading: 'みっきょう', meaning: '密教', note: '本段用“隐秘的佛教”作通俗说明；这是主播的概括。' },
      { term: 'レイブ', meaning: '锐舞派对', note: '常指伴随电子音乐、持续时间较长的聚会。' },
      { term: '配下', reading: 'はいか', meaning: '属下、麾下', note: '指受某位首领直接统率的人。' },
      { term: '火を放つ', reading: 'ひをはなつ', meaning: '放火、纵火', note: '比「火をつける」更常用于战争或案件叙述。' },
    ],
    grammar: [
      { pattern: '～と思ってくれたらいい', meaning: '你可以把它理解成……；请听者暂且采用某种理解', example: 'そんな雰囲気の仏教だと思ってくれたらいいと思います。' },
    ],
  },
  {
    vocabulary: [
      { term: '見方', reading: 'みかた', meaning: '看法、观察角度', note: '观察历史的方向会影响判断。' },
      { term: '印象', reading: 'いんしょう', meaning: '印象', note: '这里指补充背景后对事件和人物形成的评价。' },
      { term: 'ひでえ', meaning: '太过分、太残酷', note: '「ひどい」的粗犷口语音变，带强烈谴责。' },
      { term: '個人の自由', reading: 'こじんのじゆう', meaning: '个人自由', note: '本段指最终如何理解历史由个人自行判断。' },
    ],
    grammar: [
      { pattern: '～なんて、なんて～', meaning: '竟然做……，真是……；以惊讶或谴责评价行为', example: '子供や女の人を殺すなんて、なんてひでえやつだ。' },
    ],
  },
  {
    vocabulary: [
      { term: '悟りを開く', reading: 'さとりをひらく', meaning: '开悟', note: '佛教中指领悟真理、摆脱迷妄。' },
      { term: '農具', reading: 'のうぐ', meaning: '农具', note: '主播将其列为僧侣从中国带回的技术之一。' },
      { term: '整備', reading: 'せいび', meaning: '建设并完善', note: '「インターネットの整備」指建设可用的基础设施。' },
      { term: 'タイムスリップ', meaning: '穿越时空', note: '用现代技术回到过去的假设说明知识垄断。' },
    ],
    grammar: [
      { pattern: '～ないわけがない', meaning: '不可能不……；按条件推断必然会……', example: 'その状態で、お金が稼げないわけがない。' },
    ],
  },
  {
    vocabulary: [
      { term: '座', reading: 'ざ', meaning: '行业特许组织', note: '中世受权门保护并掌握营业特权的同业集团。' },
      { term: '市', reading: 'いち', meaning: '集市、市场', note: '这里读作「いち」，指进行商品交易的场所。' },
      { term: 'コミッション', meaning: '佣金、手续费', note: '主播用现代商业词说明向寺院缴纳的费用。' },
      { term: 'がっぽがっぽ', meaning: '财源滚滚、大把进钱', note: '形象表示钱持续大量流入，口语色彩很强。' },
    ],
    grammar: [
      { pattern: '～てでも', meaning: '即使付出某种代价仍然……', example: '70％のコミッションを払ってでも、たぶん結構お金は稼げます。' },
    ],
  },
  {
    vocabulary: [
      { term: '僧兵', reading: 'そうへい', meaning: '僧兵、武装僧侣', note: '中世寺院势力中承担武装行动的人。' },
      { term: '軍事力', reading: 'ぐんじりょく', meaning: '军事力量', note: '包括人员、组织和作战能力。' },
      { term: '意見できない', reading: 'いけんできない', meaning: '无法提出异议、不敢劝谏', note: '这里指无法反对强大的寺院势力。' },
      { term: '権力', reading: 'けんりょく', meaning: '权力', note: '指足以影响将军、天皇和贵族决策的力量。' },
    ],
    grammar: [
      { pattern: 'そうなると～わけだ', meaning: '这样一来，自然就会得出……结果', example: 'そうなると、権力が手に入るわけなんですよね。' },
    ],
  },
  {
    vocabulary: [
      { term: '包囲網', reading: 'ほういもう', meaning: '包围网、联合围堵态势', note: '多个敌对势力从不同方向共同牵制目标。' },
      { term: 'バックアップ', meaning: '支持、撑腰', note: '本段指信长扶持足利义昭成为将军。' },
      { term: '天下を取る', reading: 'てんかをとる', meaning: '夺取天下', note: '战国语境中指掌握全国性的最高权力。' },
      { term: '田舎者', reading: 'いなかもの', meaning: '乡巴佬、乡下人', note: '带轻蔑色彩；这里是主播替朝仓一方拟出的台词。' },
    ],
    grammar: [
      { pattern: '～てたまるか', meaning: '怎么能让……；绝不能容许……', example: '岐阜の田舎者なんかに天下を取られてたまるか。' },
    ],
  },
  {
    vocabulary: [
      { term: '裏切る', reading: 'うらぎる', meaning: '背叛、辜负', note: '本段指浅井从信长的盟友转投朝仓。' },
      { term: '義兄弟', reading: 'ぎきょうだい', meaning: '结义或姻亲兄弟', note: '这里指浅井长政因婚姻与信长形成的亲属关系。' },
      { term: '首を取る', reading: 'くびをとる', meaning: '斩取首级', note: '战国叙述中表示杀死敌方重要将领。' },
      { term: '姉川の戦い', reading: 'あねがわのたたかい', meaning: '姊川之战', note: '本段中信长战胜朝仓、浅井联军的战役。' },
    ],
    grammar: [
      { pattern: '～やがる', meaning: '竟敢……；以粗鲁口气表达愤怒或轻蔑', example: 'あの野郎、裏切りやがって。' },
    ],
  },
  {
    vocabulary: [
      { term: '中立', reading: 'ちゅうりつ', meaning: '中立', note: '指既不帮助朝仓、浅井，也不帮助信长。' },
      { term: 'なめる', meaning: '小看、轻视', note: '「なめられたもんだ」表达被低估后的恼怒。' },
      { term: '目に物を見せる', reading: 'めにものをみせる', meaning: '给对方点厉害看看', note: '表示让轻视自己的人付出代价。' },
      { term: 'もやもやする', meaning: '纠结、难以释怀', note: '指疑问或情绪无法得到清楚解决。' },
    ],
    grammar: [
      { pattern: '～たものだ／～たもんだ', meaning: '真是处于……境地；本句表达被轻视后的感叹', example: '俺もなめられたもんだ。' },
    ],
  },
  {
    vocabulary: [
      { term: '楽市楽座', reading: 'らくいちらくざ', meaning: '乐市乐座政策', note: '本段用于说明取消“座”和“市”限制的政策。' },
      { term: '盛り上がる', reading: 'もりあがる', meaning: '兴旺起来、活跃起来', note: '本段指商业活动因政策而发展。' },
      { term: '経済政策', reading: 'けいざいせいさく', meaning: '经济政策', note: '统治者为影响经济活动采取的措施。' },
      { term: 'コントロール', meaning: '控制、管控', note: '本段指政治势力限制寺院权力和活动。' },
    ],
    grammar: [
      { pattern: '～がために', meaning: '正因为……而导致；多用于重大或不利结果', example: 'お金と権力と武力を持ってしまったがために、政治の中に入っていきました。' },
    ],
  },
  {
    vocabulary: [
      { term: '地質調査', reading: 'ちしつちょうさ', meaning: '地质调查', note: '通过地层、土壤和地下遗留物调查当地情况。' },
      { term: '側面', reading: 'そくめん', meaning: '侧面、一个方面', note: '指同一历史事件可从多种角度理解。' },
      { term: '末裔', reading: 'まつえい', meaning: '后裔、后代', note: '指2021年仍在世的织田家和明智家后人。' },
      { term: '供養する', reading: 'くようする', meaning: '祭奠、超度', note: '以佛教仪式追悼亡者并祈求安宁。' },
      { term: '安らか', reading: 'やすらか', meaning: '安宁、平静', note: '用于祈愿亡者在天国平静生活。' },
      { term: '連鎖', reading: 'れんさ', meaning: '连锁、连锁反应', note: '指怨恨和报复不断引发下一次报复。' },
    ],
    grammar: [
      { pattern: '～んじゃないかっていう話もある', meaning: '也有“会不会是……”的说法；多层降低断言强度', example: '嘘の情報を流したんじゃないかっていう話もあるそうです。' },
    ],
  },
  {
    vocabulary: [
      { term: '食べやがる', reading: 'たべやがる', meaning: '竟敢吃', note: '「～やがる」粗鲁地表达愤怒或轻蔑。' },
      { term: 'しょうがねえ', meaning: '没办法、算了', note: '「しょうがない」的粗犷口语音变。' },
      { term: '丸く収まる', reading: 'まるくおさまる', meaning: '圆满解决、平稳收场', note: '指冲突不再扩大，事情和缓地告一段落。' },
      { term: '調べがい', reading: 'しらべがい', meaning: '研究的价值', note: '「动词ます形＋がい」表示做某事值得。' },
    ],
    grammar: [
      { pattern: '～やがる', meaning: '竟敢……；带愤怒或轻蔑', example: '俺が大事にしていたケーキ食べやがって。' },
      { pattern: '～がいがある', meaning: '值得……；做……有价值', example: '調べがいのある歴史の人物です。' },
    ],
  },
]

export default teachingContent
