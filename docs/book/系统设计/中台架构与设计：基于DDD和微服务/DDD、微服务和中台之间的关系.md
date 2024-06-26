---

---

# DDD、微服务和中台之间的关系

DDD和微服务来源于西方，而中台诞生在中国的阿里巴巴。DDD在十多年前提出后一直默默前行，中台和微服务是近几年才出现的设计理念，提出后就非常火爆。 

这三者看似风马牛不相及，实则缘分匪浅。中台是抽象出来的业务模型，微服务是业务模型的系统实现，DDD作为方法论可以同时指导中台业务建模和微服务建设，三者相辅相成，完美结合。 

你可能会问，DDD为什么可以同时指导中台和微服务建设呢？ 
 
这是因为DDD有两把利器，那就是它的战略设计和战术设计方法

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240527113341.png)

中台在企业架构上更多是偏向业务架构，形成中台的过程实际上也是业务领域不断细分和能力沉淀的过程。在这个过程中我们会对同类通用的业务能力进行聚合和重构，再根据限界上下文和业务内聚的原则建立领域模型。DDD战略设计最擅长的就是领域建模。 

在中台完成领域建模后，DDD战略设计构建的领域模型就可以作为微服务设计的输入。此时，限界上下文和领域模型可以作为微服务拆分和设计的边界和依据，所以，DDD的战术设计又恰好可以与微服务设计完美无缝结合。 

可以说，业务中台和微服务正是DDD实战的最佳场景。

## DDD和中台的本质

DDD和中台都强调从业务领域出发，我们先来看看DDD和中台的本质，分析它们的共性，进而找出它们之间的关系。

### DDD的本质

在研究和解决业务问题时，DDD会按照一定的规则将业务领域进行细分，当领域被细分到一定程度后，DDD会将要解决的问题范围限定在特定的边界内，并在这个边界内构建领域模型，进而用代码实现该领域模型，解决相应业务领域的应用建设问题。 

在领域细分过程中，你可以将领域分解为子域，子域还可以继续分为子子域，一直到你认为这个子域的大小，正好适合你的团队开展领域建模工作为止。当子域划分完成后，你还可以根据子域自身的重要性和功能属性，将它们划分为三类不同的子域，它们分别是：核心子域、支撑子域和通用子域

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240527113649.png)

当然，每个企业的业务模式、战略目标和商业模式可能会不同，因此它们的领域定位和职责就会有些不一样，在核心子域的划分上肯定也会有一定差异。因此，当你去做领域划分的时候，请务必结合企业核心战略和企业具体情况。 

通过领域划分和进一步的子域划分，我们就可以区分不同子域在企业内的功能属性和重要性，进而采取不同的资源投入和建设策略。这种子域的分类方法，在企业IT系统建设过程中对于确定资源的投入策略十分重要，还可以帮助企业确定中台的领域边界和属性。

## 中台的本质

中台来源于阿里的中台战略（详见《企业IT架构转型之道：阿里巴巴中台战略思想与架构实战》）。2015年年底，阿里巴巴集团对外宣布全面启动中台战略，构建符合数字时代的更具创新性、灵活性的“大中台、小前台”组织机制和业务机制，即作为前台的一线业务会更敏捷、更快速地适应瞬息万变的市场，而中台将集合整个集团的运营数据能力、产品技术能力，对各前台业务形成强力支撑。 

综上，中台的本质其实就是提炼各个业务板块的共同需求，进行业务和系统抽象，形成通用的、可复用的业务模型，打造成组件化产品，供前台部门使用。前台要做什么业务，需要什么资源，就可以直接找中台，而不需要每次都去改动自己的底层。

## DDD、中台和微服务的协作

实际上更多的企业可能会聚焦在传统企业这类中台建设模式上，也就是将通用能力与核心能力全部中台化，以满足不同渠道核心业务能力的复用。接下来我们还是把重点放在这类传统企业的中台建设模式上进行分析。 

传统企业可以将需要共享的公共能力进行领域建模，建设面向公共能力复用的通用能力中台。除此之外，传统企业还会将核心能力进行领域建模，建设面向不同渠道的核心能力复用的核心能力中台。这里的通用能力中台和核心能力中台都属于业务中台的范畴。


DDD将子域分为核心子域、通用子域和支撑子域，其主要目的是通过识别企业重点领域，有区别地确定战略资源的投入。一般来说，企业战略投入的重点是核心子域，而通用子域和支撑子域之间在战略资源投入上区分度并不高，因此在后面的设计中，暂时不严格区分通用子域和支撑子域。 

DDD、阿里中台战略和微服务架构这三者出现的时代和背景不同。同样的内容，在它们各自的理论体系中名词术语和表达方式也存在很大的差异，各自论述的内容在企业内也分别属于不同维度。 
那它们之间到底有着何种神秘的关系？我们应该如何建立这几个理论体系的通用语言，组织它们协同工作呢？

我们分别从DDD领域建模和中台建设这两个不同的视角，对企业同一个领域业务架构的分解过程进行分析和对照，看看它们到底存在何种关联关系。

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240527114046.png)

如果将企业内整个业务领域看作一个问题域的话，企业内的所有业务就是一个领域。在进行领域细分时，从DDD视角来看，子域可分为核心子域、通用子域和支撑子域。从中台建设的视角来看，业务领域细分后的业务中台，可分为核心中台和通用中台。 

从领域功能属性和重要性对照来看：通用中台对应DDD的通用子域和支撑子域，实现企业可复用的通用业务能力；核心中台对应DDD的核心子域，实现企业的核心业务能力。 

从领域的功能范围来看，子域与中台同属于业务子域，它们的功能边界是一致的。领域模型所在的限界上下文对应微服务，限界上下文可以作为微服务拆分的依据。

建立了这个映射关系后，我们就可以用DDD来为中台构建领域模型了。 

这里还是以上面的保险领域为例。按照上面的映射关系，保险域的业务中台可以分为两类：第一类是提供保险核心业务能力的核心中台（比如营销、承保和理赔等核心子域）；第二类是支撑核心业务流程完成保险全流程的通用中台（比如订单、支付、客户和用户等通用子域）。

DDD有一个重要的原则，就是首先要建立通用语言的原则。在将DDD的方法引入中台设计时，我们首先需要建立中台和DDD的通用语言。DDD的核心子域、通用子域和支撑子域等子域与中台是一个层级的概念，那我们不妨先将子域和中台这两个不同的概念统称为中台。 

在将业务领域划分为不同的中台后，在中台这个子域内，你可以通过事件风暴，找出限界上下文，对中台进行进一步设计和细分，然后根据限界上下文最终完成业务领域建模，构建出中台领域模型。由于不同中台业务领域的功能不同，限界上下文的数量和大小就会不一样，领域模型也会不一样。 

当完成业务建模后，我们就可以将领域模型作为微服务设计的输入，采用DDD战术设计和DDD分层架构模型，设计聚合、实体、值对象、领域事件、领域服务以及应用服务等领域对象，完成微服务的设计和开发。

## 如何完成中台业务模型

中台业务抽象的过程实际上就是业务建模的过程，对应DDD的战略设计。中台系统抽象的过程就是微服务的设计过程，对应DDD的战术设计。 

在了解了DDD、中台和微服务三者的工作方式和关系后，沿着上面的话题，我们接下来结合DDD领域建模的方法，聊聊中台业务建模，初步了解DDD在中台领域建模的大致设计过程。

采用DDD方法的中台领域建模大致可以分为如下五个步骤。 

第一步，按照核心业务流程节点（通常适用于核心子域）或者功能属性和集合（通常适用于通用子域或支撑子域），将业务领域细分为多个中台，再根据中台的功能属性或重要性归类到核心中台或通用中台。核心中台设计时要考虑企业战略发展和核心竞争力以及多渠道核心能力复用，通用中台要站在企业高度进行抽象和标准化设计，面向所有业务领域实现能力共享和复用。

为什么要将领域分解为中台后再构建领域模型，而不是直接在一个大的领域开展领域建模呢？

这是因为如果业务领域太大，不便于我们开展事件风暴。因此将这个大的领域按照业务职能和功能聚合边界，拆分为大小合适的子域，然后再分别构建领域模型。 

第二步，选取中台所在的业务领域，运用事件风暴方法，通过用例分析、业务场景分析或用户旅程分析等方法，找出业务领域的实体、聚合和限界上下文。依次完成各个中台的领域分解和领域建模。 

在建模的过程中你可能会发现某些领域模型中的领域对象或业务功能，会同时出现在其他领域模型中。也有些本应该是同一个聚合的领域对象，却分散在其他中台的领域模型里。这样会导致领域模型不完整或者通用能力不够内聚。不过先不要着急，这些问题是我们中台业务建模过程中需要解决的，这一步我们只需要初步确定主领域模型就可以了。 

为什么要确定主领域模型呢？

这是因为如果我们采用自底向上的方法来构建中台领域模型时，不同的业务领域由于重复建设，可能会出现一些局部功能重叠的情况。也就是说这些实体本应该在同一个限界上下文内，但由于它们分布在不同应用的业务领域中，在根据应用的业务领域进行领域建模时它们很自然地就被分散到了其他业务领域的领域模型中。

比如在移动互联业务领域和传统核心业务领域，往往同时会有用户这个领域对象，因此在领域建模时，用户就会被分散到不同的领域模型中。这样是不利于构建“高内聚，低耦合”的用户领域模型的。所以，我们在领域建模时，需要将这些分散的、不完整的领域模型，通过对领域对象和业务逻辑的组合和归并，提炼出标准的、可复用的用户领域模型。 

首先我们需要从这些领域模型中，选取领域逻辑相对完整的领域模型作为主领域模型。依托这个主领域模型，充分吸收分散在其他领域模型的领域对象和领域逻辑。根据限界上下文语义和单一职责原则，基于主领域模型，提炼出“高内聚，低耦合”的领域模型。这就是第三步要完成的主要工作。

第三步，在确定主领域模型后，以主领域模型为基准，逐一扫描其他中台领域模型，根据名称或业务动作的相似性等条件，检查是否存在重复的领域模型或领域对象，或者游离于主领域模型之外，但与主领域模型同属于一个限界上下文的领域对象。将这些重复或游离的领域对象，合并到主领域模型，提炼并重构主领域模型，完成领域模型设计。

第四步，选择其他领域模型重复第三步，直到所有领域模型完成领域对象比对和领域逻辑重构。

第五步，将领域模型作为微服务设计的输入，完成微服务的拆分和设计，完成微服务落地。 

综上所述，你可以了解到采用DDD方法在中台领域建模中的大致过程。

DDD战略设计涵盖了第一步到第四步，主要包括：将业务领域分解为不同属性的中台，将中台区分为核心中台和通用中台，在中台这个业务边界内完成领域建模，构建中台业务模型。 

DDD战术设计主要在第五步，将领域模型作为微服务设计的输入，映射为微服务就完成中台的系统落地了。

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240527115000.png)

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240527115029.png)

## 小结

中台本质是业务模型，微服务是中台业务模型的系统落地，DDD是一种设计思想，它可以同时指导中台业务建模和微服务设计，它们之间就是这样的一个铁三角关系。

相信DDD与中台的完美结合，可以让你的中台建设如虎添翼！

