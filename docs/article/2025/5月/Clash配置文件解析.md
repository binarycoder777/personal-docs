---

---

# Clash配置文件解析

> 作为一名计算机相关从业人员，相信绝大多数都或多或少接触过Clash这个工具，虽然很多机场已经贴心地帮我们整好了配置，但一旦想按自己的需求改一改，比如上某个网站不想走代理，就懵了——这东西咋改啊？下面便是阅读学习记录一下相关内容的。篇幅较短，内容如有不对之处，请多有指出。

## 配置文件框架长什么样？

```yml
mixed-port: 7890
allow-lan: true
bind-address: "*"
ipv6: false
mode: rule
log-level: info
external-controller: 127.0.0.1:9090
secret: ""
dns:
proxies:
proxy-groups:
rules:
```
这就是个模板，我们等会会一块块填进去。下面来一段段看：

| 参数                  | 作用说明                                           |
| ------------------- | ---------------------------------------------- |
| mixed-port          | 一个端口搞定 HTTP(S) + SOCKS4/5，不需要分开两个端口           |
| allow-lan           | 允许局域网设备访问你的代理，比如手机连你电脑走代理                      |
| bind-address        | 配合上面那项用的，设置监听哪个 IP，一般写 `"*"` 就行                |
| ipv6                | 是否启用 IPv6，我个人觉得问题多多，所以建议关掉                     |
| mode                | 路由模式，`rule` 是规则分流，`global` 是全走代理，`direct` 是全直连 |
| log-level           | 日志级别：调试时用 `info`，懒得看日志可以用 `warning` 或 `error`  |
| external-controller | 给 Clash 的图形界面控制面板用的端口，默认 127.0.0.1:9090        |
| secret              | 图形界面访问的密码，懒得设置可以留空                             |

🔥 三大重点：dns / proxy-groups / rules  这三个是我们“想去哪儿走哪条路”的关键

##  DNS 配置（你能上不了网，可能就是它出的问题）

DNS 配置不仅是让你能访问网站这么简单，它还决定了你访问某个域名的时候，是不是会“穿墙失败”。

```yml
dns:
  enable: true
  prefer-h3: true
  use-hosts: true
  use-system-hosts: true
  respect-rules: false
  listen: 0.0.0.0:1053
  ipv6: false
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'
    - "+.local"
    - localhost.ptlogin2.qq.com
  default-nameserver:
    - tls://1.12.12.12
    - 223.5.5.5
    - 119.29.29.29
  nameserver:
    - https://dns.alidns.com/dns-query
    - https://doh.pub/dns-query
  proxy-server-nameserver:
    - https://dns.alidns.com/dns-query
    - https://doh.pub/dns-query
  fallback:
    - tls://1dot1dot1dot1.cloudflare-dns.com
    - tcp://1.1.1.1
    - https://1.0.0.1/dns-query
    - https://1.1.1.1/dns-query
  fallback-filter:
    geoip: true
    geoip-code: CN
    geosite:
      - gfw
    ipcidr:
      - 240.0.0.0/4
      - 0.0.0.0/32
      - 127.0.0.1/32
    domain:
      - '+.google.com'
      - '+.facebook.com'
      - '+.youtube.com'
```

讲重点就好：

enhanced-mode: fake-ip：推荐开启，防止部分 App 死活直连无法代理。

default-nameserver 和 nameserver：一个是给 DNS 本身用的，一个是解析网站用的。一般一个国内（快），一个国外（准）。

fallback：当国内 DNS 可能被污染，自动用国外的去查。

proxy-server-nameserver：专门用来解析你机场节点用的域名（比如 xxx.us）

## 策略组（决定“谁”可以选“哪个”节点）

策略组就是给你的一堆节点分组，方便后面 rules 分流的时候选用。

```yml
proxy-groups:
  - name: "auto"
    type: url-test
    proxies:
      - 节点A
      - 节点B
    url: http://www.gstatic.com/generate_204
    interval: 300

  - name: "proxy"
    type: select
    proxies:
      - auto
      - 节点A
      - 节点B
```

url-test：会定时测速，自动选择最快的

select：你可以手动在图形界面上切换用哪个

## 分流规则（最关键的一环）

分流规则决定了你访问某个网站，是走代理还是直连。

**举个例子**
```yml
rules:
  - DOMAIN-SUFFIX,google.com,proxy
  - DOMAIN-SUFFIX,baidu.com,DIRECT
  - GEOIP,CN,DIRECT
  - MATCH,proxy

```
说明：
- 访问 Google 走代理
- 访问百度直连
- IP 是中国的全直连
- 其他全部默认走代理

推荐去看 ACL4SSR 整理好的规则库，里面分得很细，包括广告拦截、全球媒体、国内 App 等等。

## 远程配置怎么用？

要想把节点转换成Clash能用的配置文件，订阅转换网站可以大幅降低中初级玩家的工作量，其大致的逻辑就是让“节点”以“远程配置文件”的规则形成“clash配置文件”。

然后将配置文件导入clash中，这也是通过常见的订阅转换网站的思路。

## 结语

记录主要是想遗忘的时候能快速想起来，确实配置太多了，有很少会关注，但也别被一堆配置吓住了。看起来复杂，但只需要理解三个重点：DNS、策略组、分流规则。其他的照着抄问题也不大。

工具的使用很多时候都不会关注背后的细节，但很多时候细节起始也没想象那么复杂。加油吧💪🏻


