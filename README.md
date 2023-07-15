# LitCode - An offline judge for BUET offline assignments

Preview
-------

## PROBLEMSET

![image](https://github.com/selen0phile/litcode/assets/59266402/fe85efed-20a7-457b-b3c2-11a48688b1a9)

- Problems / Offline assignments are displayed here.
- Problems can be searched by title and tags.
- Solved problems are identified by a gradient.
- Problem statements and necessary files (input,output,metadata) can be downloaded as zip file.
- Submission URL of moodle is available for each problem.

## CODE EDITOR

![image](https://github.com/selen0phile/litcode/assets/59266402/4254424e-47ca-4ea4-b08f-615cc09276a3)

- Problem statement, constraints, sample input/output and code editor is displayed here.
- The code editor compiles and runs the code locally (in your pc). So a local server is necessary. Download and install first.
- You must compile the C++ code before running it.
- "Run on samples" runs the code on sample test cases. "Submit" runs on the hidden test cases.
- Difference between your output and correct output will be displayed incase of mismatch.
- You must strictly maintain the output format to get "Accepted"

## EXPORT/IMPORT

![image](https://github.com/selen0phile/litcode/assets/59266402/b26675bf-e04b-49a1-a6fb-f21ee6d4bc9a)

- Your codes and progress are saved in the browser. They will no longer be available on a different browser. To solve this, you can export your progress and codes to a zip file, and then import it back to a different browser.
- Export will provide you a zip file containing your progress of the current browser (and cached problems if you want).
- Importing the zip file will add the progress of that zip file to current browser.
- Progress/cache can be erased from browser.

## ADD PROBLEM

![image](https://github.com/selen0phile/litcode/assets/59266402/a21a5f92-e226-4451-930e-e8f151bf6f48)

- A problem consists of:
  **1. statement.txt: ** This file contains the problem statement. You can write mathjax equations here.
  **2. constraints.txt: ** This file contains the constraints (just for a better understanding. you are encouraged to write constraints here instead of writing them inside the statement.txt). You can write mathjax equations here.
  **3. meta.json: ** This is a json file of the following syntax:
  ```json
  {
    "added":"7/1/2023, 11:55:00 PM",
    "deadline":"7/6/2023, 11:55:00 PM",
    "tags":"floyd warshall, matrix",
    "link":"https://moodle.cse.buet.ac.bd/mod/assign/view.php?id=12686"
  }
  ```
  **4. si_{x}.txt, so_{x}.txt: ** These are sample input and output file. $x$ is the test number. $1<=x<=10$
  **5. in_{x}.txt, out_{x}.txt: ** These are hidden input and output file. $x$ is the test number. $1<=x<=10$

- To add a problem, you have to upload all these files together (select all these files together while uploading)
- Only users with permission can add problems
  
