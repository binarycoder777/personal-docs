---

---

# 内容安全策略(CSP)：每个Web开发人员必须了解的内容

解决一个问题首先便是需要发现问题，在开始讲解CSP之前，需要先了解什么是跨站脚本 (XSS) 注入攻击。


## 跨站脚本注入

大多数的web应用数据流向都是从数据库获取数据，然后返回给前端进行渲染。但想象一下，如果数据库的数据来源于用户，即攻击者通过表单将一些恶意脚本注入写到了数据库，当后续的请求需要查询该数据返回给前端时，浏览器将会执行该脚本，此时便会出行未知的风险...

让我们想象一下，您是一名黑客，想要窃取电子商务网站用户的信用卡号。

您可以做的一件事是编写一些 JavaScript，记录用户输入信用卡详细信息时支付页面上的每次击键。

由于浏览器执行页面上的任何 JavaScript，而 JavaScript 可以读取、写入或修改网站的任何部分，如果你能找到一种方法，在电子商务网站上插入你的糟糕的 JavaScript 代码，那么用户的信用就会受到影响。卡号不再安全。

但为了让浏览器执行此 JavaScript，它需要成为网站代码的一部分。因此如何在电子商务网站上获取这些恶意的 JavaScript 代码，以便用户的浏览器在付款时执行它，便是一个问题。

此时，您注意到该电子商务网站上有一个表单，任何人都可以添加有关产品的评论。因此，您创建了一个帐户，而不是进行真正的评论，而是在文本区域中键入以下恶意的JavaScript代码。

在您提交评论后，浏览器会将虚假评论（JavaScript代码）发送到电子商务网站的后端服务器，该服务器将其以纯文本形式保存在数据库中。

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240401164826.png)

接下来，在对该请求的响应中，后端将您重定向到相同的产品页面，该页面刷新并从后端获取相同的虚假评论。后端脚本立即从数据库中获取存储的评论并将其发送到浏览器。

![](https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/20240401164846.png)

在收到包含虚假评论的 HTML 后，浏览器认为这是您想要执行的脚本，并立即执行它，并向您显示警报框。

更重要的是，由于评论是公开的并且对网站的每个用户都可见，因此包含注入脚本的相同 HTML 会发送给每个其他用户，向他们发出相同的警报！

现在您知道该网站容易受到 XSS 攻击，您可以编写一个复杂的脚本来记录用户的击键并发出获取请求以将所有这些数据发布到您的其他网站，从而保存所有这些信息供您以后利用。或者，您可以通过访问用户的会话信息来完全劫持用户的会话，这使您可以以该用户的身份远程登录。

然后，通过在产品页面上添加另一个虚假评论，以与警报脚本相同的方式将其插入数据库中。

**到现在，你已经成功实施了跨站脚本攻击。**
```
攻击者可以利用跨站点脚本漏洞来利用从数据库获取用户提交的数据的任何页面。攻击者会将不良 JavaScript 代码注入数据库，该代码稍后将由网站获取，并在用户访问该网站时由用户的浏览器执行。
```
XSS 是最常见的安全漏洞之一。攻击者可以尝试在可以提交表单的任何位置注入此脚本，例如文章的标题或正文、产品评论或评论。如果网站不防范 XSS，他们就可以完全访问网站上的数据。

现在从电子商务网站开发者的角度来思考。您如何减轻这种攻击？

## 解决方案一：转义 HTML 字符

防止跨站点脚本攻击的一个简单修复方法是获取所有用户提交的文本，并将其中的任何特殊控制字符（如<、>等）替换为相应的实体编码。这称为字符转义。

例如，HTML
```html
<script>alert('hello world')</script>
```
被转换为
```html
&lt;script&gt;alert('hello world')&lt;/script&gt;
```
当浏览器看到转义的内容时，它会像常规文本一样识别并呈现它，但不会将其视为 HTML 标记。换句话说，它不会执行转义< script >标签内的代码，这正是我们想要的。

一般来说，您需要在 HTML 上下文中转义以下字符，这样它们就不会向标记添加任何特殊行为。
```
小于符号 (<) 与&lt;
大于符号 (>) 与&gt;
双引号 (") 与&quot;
单引号 (') 与&#39;
与号 (&) 与&amp;
```

在许多情况下，确保正确转义用户提交的 HTML 内容可以帮助您保护用户免受 XSS 攻击。如果您需要一路走下去，则必须将转义与严格的内容安全策略结合起来。

## 解决方案二：内容安全策略(CSP)

CSP 背后的基本思想是阻止内联脚本执行并向浏览器提供允许的受信任内容源（脚本、样式表、字体、插件等）列表。即使攻击者注入了错误的脚本，浏览器也不会执行它，因为 CSP 会阻止内联脚本执行。

XSS 攻击的根本原因是浏览器执行 HTML 中包含的所有内联 JavaScript 的能力。如果有一种方法告诉浏览器不要执行任何内联 JavaScript 以及从外部域加载的任何脚本怎么办？

```
内联是指在标签之间编写的任何代码<script>。这只会留下包含在<script src="my-domain.com/safe.js">, ie 属性中的安全 JavaScript 代码src。
```

您可以使用Content-Security-PolicyHTTP 响应上的标头来实现此目的，该标头规定了内容的安全策略。从本质上讲，这个标头做了两件事：
```
指示浏览器阻止所有内联脚本执行
提供加载外部资源的安全域列表，阻止所有其他来源。
```
虽然它最常用于脚本，但它也控制其他资源，如样式表、字体、插件等。

实施严格的 CSP 可防止浏览器从任何其他位置获取脚本。这使得不良行为者很难在您的网站中注入不良 JavaScript 代码。即使他们以某种方式注入它，浏览器也不会执行它，因为它是内联的。

所有现代浏览器都支持 CSP。由于跨站点脚本攻击是由于浏览器上不需要的 JavaScript 执行而发生的，因此锁定所有外部和内联 JavaScript 对防止 XSS 攻击大有帮助。

当您的网站实施严格的 CSP 时，攻击者将无法在网站上运行任何不良 JavaScript。


## CSP是怎样工作的？

以下是标准 CSP 标头的示例。
```bash
Content-Security-Policy: script-src 'self' https://safe-external-site.com; style-src 'self'
```
在上面的标题中，术语script-src和style-src是分别指定 JavaScript 和样式表有效源的指令。

这两个指令都告诉浏览器不要执行任何内联 JavaScript 或样式表。此外，
- 脚本策略告诉浏览器只运行从同一个域 ( self) 或域中获取的脚本safe-external-site.com。如果网站托管在mysite.com ，则浏览器将阻止除从mysite.com和safe-external-site.com加载的脚本之外的所有脚本，因为我们明确允许它。
- 样式策略告诉它只允许来自同一域的样式表。不允许使用外部样式表。

```
src仅当 JavaScript 通过元素中的属性从您自己的域导入时，浏览器才会执行 JavaScript <script>。
```

< meta >使您还可以在位于元素下的标记中提供策略，而不是使用 HTTP 标头< head >。这是通过标签提供的内容安全策略< meta >。
```
<meta http-equiv="Content-Security-Policy" content="script-src 'self' https://safe-external-site.com">
```

## unsafe-inline 可让您绕过 CSP
如果由于某种原因，您必须允许内联 JavaScript 或样式，请使用unsafe-inline相应指令上的值。例如，以下策略允许所有内联 JavaScript，因此违背了 CSP 的基本目的。
```
Content-Security-Policy: script-src 'self' 'unsafe-inline' https://safe-external-site.com
```
如果您确实必须使用内联脚本，则不建议使用该unsafe-inline。如果您绝对需要执行内联脚本，下面有一个更好的解决方案。

## 重要的 CSP 指令和价值观
到目前为止，我们已经看到了script-src和style-src，它们指定了脚本和样式表的有效源。这里还有其他一些重要的内容。有关完整列表，请查看[MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy?ref=writesoftwarewell.com#directives)中的指令。
```
default-src：定义获取所有资源的默认策略。每当缺少更具体的策略时，浏览器将回退到default-src策略指令。例子：default-src 'self' trusted-domain.com
img-src：定义图像的有效来源，例如img-src 'self' img.mydomain.com
font-src：定义字体资源的有效来源。
object-src：定义插件和外部内容的有效源，例如<object>或<embed>元素。
media-src：定义音频和视频的有效源。
```
除了 之外unsafe-inline，源列表还接受以下值。同样，这不是一个完整的列表，请参阅[MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy?ref=writesoftwarewell.com#directives)以获取更多值。

> ''注意：前四个值需要加引号。

##  nonce 属性
当您确实需要内联脚本和样式时，请使用 nonce 属性

> 该nonce属性对于允许特定的内联脚本或样式元素很有用。它可以帮助您避免使用允许所有内联代码的CSP 指令：unsafe-inline

该术语nonce指的是仅使用一次的单词或短语。

在 CSP 上下文中，  是和标签nonce上的一个属性，允许您允许特定的内联和元素，同时仍然阻止所有其他内联脚本和样式。这可以让您避免使用unsafe-inline指令，该指令允许所有内联执行并且不安全。

使用该nonce属性可以让您保留 CSP 的基本优势，同时仍然允许您绝对需要的特定内联执行。

### 它是如何工作的？

- 对于每个请求，服务器都会创建一个无法猜测的随机 Base64 编码字符串。这是随机数值，例如dGhpcyBpcyBhIG5v==

- 服务器将此随机数值插入到您想要允许的所有内联脚本和样式元素中，作为属性的值nonce。

```html
<script nonce="dGhpcyBpcyBhIG5v==">.. ..</script>

<style nonce="dGhpcyBpcyBhIG5v==">.. ..</style>
```

服务器还在和指令的Content-Security-Policy标头中插入相同的随机数值。script-srcstyle-src
```bash
Content-Security-Policy: script-src 'nonce-dGhpcyBpcyBhIG5v=='; style-src 'nonce-dGhpcyBpcyBhIG5v=='
```

当浏览器收到包含标头的 HTTP 响应时，它会看到标头中的随机数值，然后扫描包含内联脚本和样式的 HTML，并仅执行那些属性设置nonce为该值的脚本和样式。

由于攻击者无法猜测令牌，因此他们无法注入不良 JavaScript。

总而言之，特定nonce脚本和样式元素上属性的存在指示浏览器允许在这些元素中内联执行，同时仍然阻止所有其他不具有该属性的内联脚本和样式nonce。

它告诉浏览器这些元素不是由黑客注入的（因为他们无法猜测随机数值），而是由服务器故意插入的，因此它们可以安全执行。

## 采用 CSP：从报告开始，但不强制执行 CSP 违规行为

许多旧网站大量使用内联 JavaScript 或托管在外部域上的脚本。如果您有一个巨大的遗留代码库，其中到处都是 PHP/HTML 文件中的内联脚本，该怎么办？最重要的是，您不知道有多少地方使用了内联和外部脚本。该怎么办？

由于 CSP 默认情况下会阻止所有内联脚本并阻止所有外部源，因此您必须删除/重构所有内联 JavaScript 和外部源，或者在策略中明确允许它们。

否则，如果您立即启用严格的策略来阻止所有内联或外部脚本和样式表，那么您就会遇到麻烦。浏览器既不会加载外部脚本/样式，也不会执行内联脚本，并且网站将为您的用户崩溃并烧毁。

那你该怎么办呢？您知道重构代码以遵循最佳实践需要很长时间。您如何找出哪里违反了 CSP？

对于这个困境有一个优雅的解决方案。您可以使用仅报告模式，而不是立即设置严格的 CSP 并冒着生产中崩溃的风险。

使用Cotent-Security-Policy-Report-Only标头，您可以告诉浏览器仅报告，但不强制执行策略。

因此，浏览器仍将加载外部脚本并执行任何内联 JavaScript，但它也会使用该report-to指令向策略中定义的端点报告所有违规行为。
```bash
Content-Security-Policy-Report-Only: script-src 'self'; report-to https://mysite.com/csp-violations
```

端点可以是应用程序中的一条路径，您可以在其中编写代码来解析违规数据并将其保存在数据库中，或者您可以使用第三方服务，例如report-uri.com在浏览器的表格中很好地显示它，并支持过滤和排序。

无论如何，您都可以看到需要在代码（或策略）中进行更改以遵循安全策略的所有位置。

## 如何实施严格的 CSP
如果您确信需要为网站或应用程序实施严格的内容安全策略，则需要添加 CSP 标头、更改 HTML 模板以添加nonce属性、明确允许内容的外部域源，并测试一切正常，并且对您的用户来说没有任何问题。

以下是开始在您的网站上实施内容安全策略的分步计划。
- 举报，不执行。从Content-Security-Policy-Report-Only标头开始迭代处理您的策略。密切关注违规报告，并在出现问题时予以解决，直到不再有违规报告为止。
- 重构代码以删除内联 JavaScript 并将其移动到使用元素src上的属性加载的 JavaScript 文件< script>。重构包含内联事件处理程序（如onclick和URI）的 HTML javascript:。
- 例外。对于必须执行内联脚本或使用内联 CSS 的地方，请nonce在服务器上生成令牌，将其放在nonce脚本和样式元素的属性上，然后将其传递给策略。如果您需要加载外部脚本和样式，请将这些域添加到策略中。
- 执行政策。设置Content-Security-Policy您网站的标题。最有可能的是，您的后端框架已经支持这一点，无论是作为配置的一部分（Rails）还是通过中间件（Laravel）。如果没有，只需手动设置一项即可。
- 彻底测试。在部署到生产之前，让您的测试团队了解 CSP 并要求他们注意控制台中的任何 CSP 违规报告。最后，请注意端点日志中或网站 report-uri.com 上用户浏览器上生产中的 CSP 违规情况。

> 无论如何，将 JavaScript 与 HTML 分离是最佳实践，因为它可以清理 HTML 并保持代码库井井有条。在某种程度上，实施更严格的 CSP 并禁止任何内联 JavaScript 代码会迫使您遵循最佳实践。

以下是您将进行的更改类型的一些示例。
- < script>向和< style>元素添加随机数
```html
<script src="my_script.js"></script>
<script>alert('hello world')</script>

<style>
  body {
      background-color: green;   
  }
</style>
```
变成
```html
<script nonce="token" src="my_script.js"></script>
<script nonce="token">alert('hello')</script>

<style nonce="token">
  body {
      background-color: green;   
  }
</style>
```

- 重构内联 JavaScript 处理程序和 URI

通常，遗留网站可以包含使用onclick或onerror回调的事件处理程序。这些很容易受到 XSS 攻击。重构它，以便从 JavaScript 块添加处理程序。理想情况下，您应该将其移动到单独的 JavaScript 文件中。

```html
<script> 
    function handle() {
      // click handler code
    } 
</script>

<button onclick="handle();">Click Me</button>
```
变成
```html
<button id="submit-btn">Click Me</button>

<script nonce="token">
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('submit-btn')
          .addEventListener('click', () => { 
            // click handler code
          });
});
</script>
```
请务必记住，策略是按页面定义的。您需要在要保护的每个 HTTP 响应上发送此标头。也就是说，框架应该为您处理这个问题。例如，Rails 允许您为整个应用程序以及控制器操作级别定义它。

## 最后
在跨站点脚本注入攻击中，攻击者试图在网站的 HTML 中注入不良代码，欺骗用户的浏览器执行该代码。为了防止这种情况，您需要转义从表单收到的用户提交的数据。此外，您需要设置严格的内容安全策略，指示浏览器阻止所有内联脚本执行，并仅从预先批准的域加载外部脚本。

一旦您开始转义用户提交的内容并实施严格的 CSP，您就可以很好地保护您的用户。黑客很难在具有严格且严密的安全策略的页面中注入任何随机脚本。

也就是说，拥有严格的 CSP 并不能完全保证您的网站完全免受攻击。将其与其他安全最佳实践和手动安全审查相结合，以进一步减少攻击的机会。

结束语：如果您运行的静态博客没有任何用户生成的内容，您可能不需要担心严格的 CSP。另一方面，如果您运行的应用程序管理医疗保健和金融等行业中的敏感个人身份信息，则制定严格的内容安全策略至关重要。






















