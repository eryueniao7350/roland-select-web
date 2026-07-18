(function () {
  var API_BASE = '/functions/v1/roland-select';

  var form = document.getElementById('intake-form');
  var messageBox = document.getElementById('form-message');
  var submitButton = form.querySelector('.submit-button');

  function setMessage(text, kind) {
    messageBox.textContent = text;
    messageBox.className = 'form-message' + (kind ? ' ' + kind : '');
  }

  function collectPayload(formData) {
    return {
      salesRep: formData.get('salesRep') || '',
      customerName: formData.get('customerName') || '',
      contact: formData.get('contact') || '',
      intent: formData.get('intent') || '',
      model: formData.get('model') || '',
      serialNumber: formData.get('serialNumber') || '',
      totalImpressions: formData.get('totalImpressions') || '',
      productionHours: formData.get('productionHours') || '',
      maintenanceHistory: formData.get('maintenanceHistory') || '',
      maintenanceNotes: formData.get('maintenanceNotes') || '',
      conditionIssues: formData.getAll('conditionIssues'),
      conditionNotes: formData.get('conditionNotes') || '',
      expectedPrice: formData.get('expectedPrice') || '',
      expectedTimeline: formData.get('expectedTimeline') || '',
      notes: formData.get('notes') || '',
    };
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const payload = collectPayload(new FormData(form));

    submitButton.disabled = true;
    setMessage('提交中...', '');

    try {
      const response = await fetch(API_BASE + '/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const firstError = result.errors && result.errors[0];
        setMessage(firstError ? firstError.message : '提交失败，请检查表单', 'error');
        return;
      }

      setMessage('提交成功，感谢录入！', 'success');
      form.reset();
    } catch (error) {
      setMessage('网络异常，请检查后重试', 'error');
    } finally {
      submitButton.disabled = false;
    }
  });
})();
