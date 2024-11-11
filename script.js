document.getElementById("voteForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const contestant = document.querySelector('input[name="contestant"]:checked').value;
    const email = document.getElementById("email").value;

    if (contestant && email) {
        console.log(`選擇的參賽者：${contestant}, Email: ${email}`);
        document.getElementById("result").innerHTML = "感謝您的參與！預測已提交。";
        document.getElementById("voteForm").reset();
    } else {
        alert("請選擇參賽者並輸入Email！");
    }
});
