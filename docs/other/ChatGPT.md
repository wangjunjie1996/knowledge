# ChatGPT
[官网](https://chat.openai.com)  

ChatGPT is based on the GPT-3 architecture,

openAI的服务不支持中国, GAN（一个模型）

注册：基本流程可以参考这篇博客
https://zhuanlan.zhihu.com/p/589005258

注册账户：随便弄个邮箱或者就用Google、微软账号注册就行。然后可能会提示你OpenAI's services are not available in your country.

首先你需要能够访问Google（懂的都懂，不宜多言），顺利的话你会看到填写用户名的页面,如果不顺利的话，你可能还是会看到，OpenAI's services are not available in your country.这时可以尝试以下的操作：
* 代理要挂全局或者任意支持OpenAI的国家（好像中俄等国不行，香港也不行）
* 清空缓存或者重新打开浏览器；
* 新开一个无痕模式的窗口；这个巨有效！！！
最麻烦的部分：需要国外的手机账号来注册和接收验证码。

## 无需代理及注册在VsCode中使用ChatGPT
### 安装
1. 打开 Visual Studio Code
2. 单击左侧栏中的扩展程序图标
3. 搜索"ChatGPT中文版"
4. 点击安装按钮安装扩展
5. 重启VSCode
### 用法
* 在编辑器中右键触发菜单。 或者快捷键打开命令面板(ctrl+shift+p 或者 command+shift+p)，输入"ChatGPT"。可以看见目前支持的代码功能
* 执行了一个命令之后，侧边栏会弹出一个交互窗口： 

## 原理
OpenAI 使用监督学习和强化学习的组合来调优 ChatGPT，其中的强化学习组件使 ChatGPT 独一无二。OpenAI 使用了「人类反馈强化学习」（RLHF）的训练方法，该方法在训练中使用人类反馈，以最小化无益、失真或偏见的输出。

chatgpt和instruct GPT是同源的，是一种指令式的命令， 简单来说就是先通过人工的标注方式来训练出一一种强化学习的冷启动模型和reward反馈模型。然后再通过强化学习的模式来学习出对话友好的chatGPT 

## ChatGPT 的现状和局限
ChatGPT可用于广泛的自然语言处理任务。ChatGPT的一些潜在应用包括。
1. 文本生成。ChatGPT可用于生成类似于人类的提示文本回复，这使得它可以用于创建客户服务的聊天机器人，生成对在线论坛中问题的回复，甚至为社交媒体帖子创建个性化内容。
2. 语言翻译。ChatGPT也可用于语言翻译任务。通过向模型提供一种语言的文本提示并指定目标语言，模型可以生成准确和流畅的文本翻译。
3. 文本总结。ChatGPT可用于生成长篇文件或文章的摘要。这对快速了解文本的概况很有用，而不需要阅读整个文件。
4. 情感分析。ChatGPT可以用来分析一个给定文本的情绪。这对于理解一篇文章的整体语气和情感，或检测客户反馈的情绪以提高客户满意度是非常有用的。

Like any other machine learning model, ChatGPT has certain limitations and limitations that users should be aware of. Some of the potential limitations of ChatGPT include:
* Dependence on data: ChatGPT is a machine learning model that has been trained on a large corpus of text data. As a result, the quality and accuracy of the model’s responses will depend on the quality and diversity of the data that it has been trained on. If the model is not trained on a diverse and comprehensive dataset, it may generate responses that are not relevant or accurate.
* Limited understanding: While ChatGPT is able to generate highly accurate and fluent responses to prompts, it does not have a deep understanding of the world or the ability to reason like a human. As a result, the model may not be able to generate responses to complex or abstract questions, or to understand the context and implications of a given prompt.
* Bias: Machine learning models, including ChatGPT, can sometimes exhibit bias in their responses. This can occur if the model has been trained on biased or unrepresentative data, or if the model’s algorithms are biased in some way. As a result, users of ChatGPT should be aware of the potential for bias in the model’s responses and take steps to mitigate it.
* ChatGPT Error: Even artificial intelligence can make some mistakes due to resource or technical limitations. When our attempts to access ChatGPT fail, we can follow these steps to try and resolve the problem.
    * Clear your browser cache or try logging in with a different browser
    * Try to keep refreshing the login page (there is a chance that the login will be successful)
    * Open the OpenAI server to check the current maintenance report
    * If none of these methods work, then please click on ChatGPT Error Solution.

Overall, ChatGPT is a powerful and versatile tool for natural language processing tasks. However, like any other machine learning model, it has certain limitations that users should be aware of. 

目前ChatGPT虽然什么都能写，但还是不够靠谱，它说的东西相当一部分根本就不是真的，容易给人产生幻觉和误导，

OpenAI 认为，ChatGPT “可能偶尔会产生不正确或误导性的信息”，因此仍需谨慎使用。

ChatGPT 并不完全知道任何事情。它是一个人工智能，经过训练，能够识别从互联网上收集的大量文本中的模式，然后在人的帮助下进一步训练，以提供更有用、更完美的对话。最终得到的答案可能听起来似是而非，或者是权威的，但正如 OpenAI 的警告，它们很可能是完全错误的。

ChatGPT无法处理复杂冗长或者特别专业的语言结构。对于来自金融、自然科学或医学等非常专业领域的问题，如果没有进行足够的语料“喂食”，ChatGPT可能无法生成适当的回答。

）ChatGPT需要非常大量的算力（芯片）来支持其训练和部署。抛开需要大量语料数据训练模型不说，在目前，ChatGPT在应用时仍然需要大算力的服务器支持，而这些服务器的成本是普通用户无法承受的，即便数十亿个参数的模型也需要惊人数量的计算资源才能运行和训练。，如果面向真实搜索引擎的数以亿记的用户请求，如采取目前通行的免费策略，任何企业都难以承受这一成本。因此对于普通大众来说，还需等待更轻量型的模型或更高性价比的算力平台。

ChatGPT还没法在线的把新知识纳入其中，而出现一些新知识就去重新预训练GPT模型也是不现实的，无论是训练时间或训练成本，都是普通训练者难以接受的。如果对于新知识采取在线训练的模式，看上去可行且语料成本相对较低，但是很容易由于新数据的引入而导致对原有知识的灾难性遗忘的问题。

ChatGPT仍然是黑盒模型。目前还未能对ChatGPT的内在算法逻辑进行分解，因此并不能保证ChatGPT不会产生攻击甚至伤害用户的表述。a
## 未来
* GPT-4的到来
* 减少人类反馈的RLAIF
* 补足数理短板
* ChatGPT的小型化

ChatGPT 模型的出现对于文字/语音模态的 AIGC 应用具有重要意义，会对AI产业上下游产生重大影响。从下游相关受益应用来看，包括但不限于无代码编程、小说生成、对话类搜索引擎、语音陪伴、语音工作助手、对话虚拟人、人工智能客服、机器翻译、芯片设计等。从上游增加需求来看，包括算力芯片、数据标注、自然语言处理（NLP)等。

大模型呈爆发态势（更多的参数/更大的算力芯片需求）

随着算法技术和算力技术的不断进步，ChatGPT也会进一步走向更先进功能更强的版本，在越来越多的领域进行应用，为人类生成更多更美好的对话和内容。
## ChatGPT的主要特点
ChatGPT 具有以下特征：
1. 可以主动承认自身错误。若用户指出其错误，模型会听取意见并优化答案。
2. ChatGPT 可以质疑不正确的问题。例如被询问 “哥伦布 2015 年来到美国的情景” 的问题时，机器人会说明哥伦布不属于这一时代并调整输出结果。
3. ChatGPT 可以承认自身的无知，承认对专业技术的不了解。
4. 支持连续多轮对话。
