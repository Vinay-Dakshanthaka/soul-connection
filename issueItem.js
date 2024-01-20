function hideLoader() {
    document.querySelector(".loader").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const storedIssueData = localStorage.getItem("issueData");
  
    if (storedIssueData) {
      const issueData = JSON.parse(storedIssueData);
  
      // Set the content of issueVersion
      document.getElementById("issueVersion").textContent = issueData.issueVersion;
  
      // Get the ol container
      const olContainer = document.querySelector(".ol");
  
      // Loop through contentIssuesArray and render each item
      issueData.contentIssuesArray.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <h3>${item.issueTopic}</h3>
          <p class="lead text-black ms-2 fw-bold">${item.authorName}</p>
          <button class="custom-btn-read-more btn-15">Read More</button>
        `;
        olContainer.appendChild(li);
  
        // Add event listener to the button for each item
        li.querySelector("button").addEventListener("click", () => {
          saveAndRedirect(index);
        });
      });
  
      function saveAndRedirect(index) {
        // Save the current index to localStorage
        localStorage.setItem("selectedIssueIndex", index);
  
        console.log(index);
        console.log(storedIssueData);
        // Redirect to the issue_info.html page
        window.location.href = 'issue_info.html';
      }
      hideLoader()
    } else {
      console.error("No issueData found in localStorage.");
      hideLoader()
    }
  });
  

  

  