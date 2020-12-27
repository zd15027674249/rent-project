<template>
  <div>
    <ul class="lawsAndRegulations">
      <li>
        <p>
          赌博
        </p>
        <a :href="url('/static//previewFile/gambling/关于赌博机认定标准问题.doc')">关于赌博机认定标准问题</a>
        <a :href="url('/static//previewFile/gambling/利用赌博机赌博.doc')">利用赌博机赌博</a>
        <a :href="url('/static//previewFile/gambling/黑龙江省公安机关赌博裁量标准.doc')">黑龙江省公安机关赌博裁量标准</a>
      </li>
      <li>
        <p>
          刑侦案件
        </p>
        <a :href="url('/static//previewFile/administrativeCases/互联网违法处罚标准.doc')">互联网违法处罚标准</a>
        <a :href="url('/static//previewFile/administrativeCases/公安机关办理行政案件程序规定（新）.doc')">公安机关办理行政案件程序规定（新）</a>
        <a :href="url('/static//previewFile/administrativeCases/国务院法制办公室秘书行政司关于行政机关工作人员在执行职务时侵犯公民合法权益不给予治安管理处罚的复函.doc')">国务院法制办公室秘书行政司关于行政机关工作人员在执行职务时侵犯公民合法权益不给予治安管理处罚的复函</a>
        <a :href="url('/static//previewFile/administrativeCases/违反公安行政管理行为的名称及其适用意见.doc')">违反公安行政管理行为的名称及其适用意见</a>
        <a :href="url('/static//previewFile/administrativeCases/黑龙江省治安案件裁量标准.doc')">黑龙江省治安案件裁量标准</a>
      </li>
      <li>
        <p>
          交警
        </p>
        <a :href="url('/static//previewFile/trafficPolice/中华人民共和国公安部关于公安机关办理醉酒驾驶机动车犯罪案件的指导意见.doc')">中华人民共和国公安部关于公安机关办理醉酒驾驶机动车犯罪案件的指导意见</a>
        <a :href="url('/static//previewFile/trafficPolice/大庆交通执法裁量标准.doc')">大庆交通执法裁量标准</a>
        <a :href="url('/static//previewFile/trafficPolice/机动车驾驶证申领和使用规定.doc')">机动车驾驶证申领和使用规定</a>
        <a :href="url('/static//previewFile/trafficPolice/道路交通安全法.doc')">道路交通安全法</a>
        <a :href="url('/static//previewFile/trafficPolice/黑龙江省交通违法行为代码2015.4.1.doc')">黑龙江省交通违法行为代码2015.4.1</a>
      </li>
      <li>
        <p>
          禁毒
        </p>
        <a :href="url('/static//previewFile/drug/吸毒成瘾认定标准.doc')">吸毒成瘾认定标准</a>
        <a :href="url('/static//previewFile/drug/吸毒检测程序规定.doc')">吸毒检测程序规定</a>
        <a :href="url('/static//previewFile/drug/大庆市禁毒委员会办公室文件.doc')">大庆市禁毒委员会办公室文件</a>
        <a :href="url('/static//previewFile/drug/审理毒品案件解释.doc')">审理毒品案件解释</a>
      </li>
      <li>
        <p>
          刑侦
        </p>
        <div class="case">
          <span style="display: block;margin-bottom: 10px">刑事案件立案追诉标准</span>
          <a class="caseHref" :href="url('/static//previewFile/forensic/StandardsProsecution/交警.doc')">交警</a>
          <a class="caseHref" :href="url('/static//previewFile/forensic/StandardsProsecution/公安部部分刑事案件追诉标准.doc')">公安部部分刑事案件追诉标准</a>
          <a class="caseHref" :href="url('/static//previewFile/forensic/StandardsProsecution/刑警.doc')">刑警</a>
          <a class="caseHref" :href="url('/static//previewFile/forensic/StandardsProsecution/治安管辖.doc')">治安管辖</a>
          <a class="caseHref" :href="url('/static//previewFile/forensic/StandardsProsecution/禁毒.doc')">禁毒</a>
          <a class="caseHref" :href="url('/static//previewFile/forensic/StandardsProsecution/经侦.doc')">经侦</a>
          <a class="caseHref" :href="url('/static//previewFile/forensic/StandardsProsecution/网安.doc')"> 网安</a>
        </div>
        <a :href="url('/static//previewFile/forensic/《公安机关办理刑事案件程序规定》.doc')">《公安机关办理刑事案件程序规定》</a>
        <a :href="url('/static//previewFile/forensic/刑事诉讼法常用法律条文.doc')">刑事诉讼法常用法律条文</a>
        <a :href="url('/static//previewFile/forensic/刑法修正案九.doc')">刑法修正案九</a>
        <a :href="url('/static//previewFile/forensic/黑龙江省强制医疗办法.doc')">黑龙江省强制医疗办法</a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'lawsAndRegulations',
    // ~@/assets/previewFile/gambling/关于赌博机认定标准问题.doc
    methods: {
      url (val) {
        return 'http://' + window.location.host + val
      }
    }
  }
</script>

<style>
  .lawsAndRegulations li{
    list-style: none;
    font-size: 15px;
    margin: 0;
  }
  .lawsAndRegulations li p{
    margin-bottom: 10px;
  }
  .lawsAndRegulations li .case{
    text-indent: 2em;
    margin-bottom: 10px;
  }
  .lawsAndRegulations li .case .caseHref{
    display: block;
    text-indent: 4em;
    font-size: 13px;
    margin-bottom: 10px;
  }
  .lawsAndRegulations li a{
    display: block;
    text-indent: 2em;
    font-size: 13px;
    margin-bottom: 10px;
  }
</style>