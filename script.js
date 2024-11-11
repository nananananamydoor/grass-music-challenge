const voteData = {
    "選項A": 0,
    "選項B": 0,
    "選項C": 0
};

// 檢查 Local Storage 中的數據
let emailList = JSON.parse(localStorage.getItem('emailList')) || [];
let voteRecords = JSON.parse(localStorage.getItem('voteRecords')) || [];
let storedVotes = JSON.parse(localStorage.getItem('voteData')) || voteData;

Object.assign(voteData, storedVotes);

const voteForm = document.getElementById('voteForm');
const ctx = document.getElementById('resultChart').getContext('2d');

// 初始化圖表
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Object.keys(voteData),
        datasets: [{
            label: '投票數',
            data: Object.values(voteData),
            backgroundColor: ['red', 'blue', 'green']
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// 處理表單提交
voteForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const selectedOption = document.querySelector('input[name="option"]:checked').value;

    // 檢查 Email 是否已經投過票
    if (emailList.includes(email)) {
        alert("此 Email 已經投過票了！");
        return;
    }

    voteData[selectedOption] += 1;
    emailList.push(email);
    voteRecords.push({ email, option: selectedOption });

    // 儲存資料到 Local Storage
    localStorage.setItem('emailList', JSON.stringify(emailList));
    localStorage.setItem('voteRecords', JSON.stringify(voteRecords));
    localStorage.setItem('voteData', JSON.stringify(voteData));

    updateChart();

    // 自動生成並下載 Excel 檔案
    exportToExcel();

    alert("投票成功！");
    voteForm.reset();
});

// 更新圖表的函數
function updateChart() {
    chart.data.datasets[0].data = Object.values(voteData);
    chart.update();
}

// 匯出為 Excel 的功能
function exportToExcel() {
    const records = JSON.parse(localStorage.getItem('voteRecords')) || [];

    if (records.length === 0) {
        return;
    }

    // 建立 Excel 資料
    const worksheetData = [['Email', '選項']];
    records.forEach(record => {
        worksheetData.push([record.email, record.option]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '投票結果');

    // 自動下載 Excel 檔案
    XLSX.writeFile(workbook, '投票結果.xlsx');
}
