// 性能测试脚本
const { performance } = require('perf_hooks');

// 测试API响应时间
async function testApiPerformance() {
  const results = {
    healthCheck: null,
    chatSend: null,
    coachAnalyze: null,
    overall: null
  };

  console.log('🚀 开始API性能测试...\n');

  try {
    // 测试健康检查
    const healthStart = performance.now();
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthEnd = performance.now();
    results.healthCheck = healthEnd - healthStart;
    
    console.log(`✅ 健康检查: ${results.healthCheck.toFixed(2)}ms`);

    // 测试聊天发送
    const chatStart = performance.now();
    const chatResponse = await fetch('http://localhost:3001/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: '性能测试消息',
        background: '测试背景',
        character: 'default',
        sessionId: 'perf-test'
      })
    });
    const chatEnd = performance.now();
    results.chatSend = chatEnd - chatStart;
    
    console.log(`✅ 聊天发送: ${results.chatSend.toFixed(2)}ms`);

    // 测试教练分析
    const coachStart = performance.now();
    const coachResponse = await fetch('http://localhost:3001/api/coach/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation: '用户：性能测试消息\nAI：测试回复',
        currentMessage: '性能测试消息'
      })
    });
    const coachEnd = performance.now();
    results.coachAnalyze = coachEnd - coachStart;
    
    console.log(`✅ 教练分析: ${results.coachAnalyze.toFixed(2)}ms`);

    // 计算总体性能
    results.overall = Math.max(results.healthCheck, results.chatSend, results.coachAnalyze);

    console.log('\n📊 性能测试结果:');
    console.log(`- 健康检查: ${results.healthCheck.toFixed(2)}ms`);
    console.log(`- 聊天发送: ${results.chatSend.toFixed(2)}ms`);
    console.log(`- 教练分析: ${results.coachAnalyze.toFixed(2)}ms`);
    console.log(`- 最大响应时间: ${results.overall.toFixed(2)}ms`);

    // 性能评估
    const performanceGrade = results.overall < 1000 ? '🟢 优秀' : 
                           results.overall < 2000 ? '🟡 良好' : '🔴 需要优化';
    
    console.log(`\n🎯 性能评级: ${performanceGrade}`);
    console.log(`📈 响应准确率: ${await testAccuracy()}%`);

    return results;
  } catch (error) {
    console.error('❌ 性能测试失败:', error.message);
    return null;
  }
}

// 测试响应准确率
async function testAccuracy() {
  let successCount = 0;
  const totalTests = 10;

  console.log('\n🎯 开始准确率测试...');

  for (let i = 0; i < totalTests; i++) {
    try {
      // 测试聊天API
      const chatResponse = await fetch('http://localhost:3001/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `测试消息 ${i + 1}`,
          background: '测试背景',
          character: 'default',
          sessionId: `accuracy-test-${i}`
        })
      });

      if (chatResponse.ok) {
        const data = await chatResponse.json();
        if (data.reply && typeof data.reply === 'string') {
          successCount++;
        }
      }

      // 测试教练API
      const coachResponse = await fetch('http://localhost:3001/api/coach/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: `用户：测试消息 ${i + 1}\nAI：测试回复`,
          currentMessage: `测试消息 ${i + 1}`
        })
      });

      if (coachResponse.ok) {
        const data = await coachResponse.json();
        if (data.suggestions && data.emotion_analysis && data.conflict_level) {
          successCount++;
        }
      }
    } catch (error) {
      console.log(`❌ 测试 ${i + 1} 失败:`, error.message);
    }
  }

  const accuracy = (successCount / (totalTests * 2)) * 100;
  console.log(`✅ 准确率测试完成: ${successCount}/${totalTests * 2} 成功`);
  
  return accuracy.toFixed(1);
}

// 运行测试
if (require.main === module) {
  testApiPerformance().then(results => {
    if (results) {
      console.log('\n🎉 性能测试完成！');
      
      // 检查是否满足要求
      const meetsRequirements = results.overall < 1000;
      console.log(`\n📋 交付标准检查:`);
      console.log(`- 加载时间 < 1秒: ${meetsRequirements ? '✅ 通过' : '❌ 未通过'}`);
      console.log(`- 实际最大响应时间: ${results.overall.toFixed(2)}ms`);
      
      process.exit(meetsRequirements ? 0 : 1);
    } else {
      console.log('\n❌ 性能测试失败！');
      process.exit(1);
    }
  });
}

module.exports = { testApiPerformance, testAccuracy };