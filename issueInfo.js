

document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the storedIssueData from localStorage
    const storedIssueData = localStorage.getItem("issueData");
    const storedIndex = localStorage.getItem("selectedIssueIndex");

    if (storedIssueData && storedIndex !== null) {
        // Parse the storedIssueData
        const issueData = JSON.parse(storedIssueData);

        // Get the specific item using the stored index
        const selectedItem = issueData.contentIssuesArray[parseInt(storedIndex)];

        // Set the content of the issue_info.html page
        document.getElementById("issueTopic").textContent = selectedItem.issueTopic;
        document.getElementById("authorName").textContent = selectedItem.authorName;
        document.getElementById("issueContent").textContent = selectedItem.issueContent;
    } else {
        console.error("No issueData or selectedIssueIndex found in localStorage.");
    }
});
  