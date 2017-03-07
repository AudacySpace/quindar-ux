# Building new features for Quindar UX

This file is used by the authors of Quindar organization to build new features for Quindar.

Using Git-Flow would be easier to maintain git branches. Follow the link below for documentation and getting started with Git-Flow.

http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/

Installation Instructions: https://github.com/nvie/gitflow/wiki/Installation

A useful cheat-sheet: http://danielkummer.github.io/git-flow-cheatsheet/ 

Naming convention for feature branches: 
**A\<Ticket_Number\>_\<Ticket_Label\>**

Example(using git-flow)

1. Initiate git flow
        
        cd ~/repositories/quindar-ux
        git flow init

2. Create a new feature branch (Ticket #2964 with label Developer Environment)

        git flow feature start A2964_Developer_Environment

3. Publish the branch to the remote repo
        
        git flow feature publish A2964_Developer_Environment

4. Make changes in your favorite editor.
5. Test the code as changes would be reflected in the browser (http://localhost)
6. Commit code in the feature branch and push it to the remote repo.
        
        git add <filename>
        git commit -m "<commit message>"
        git push origin feature/A2964_Developer_Environment

7. Peer Review
8. Merge the code to develop branch and switch to develop branch using the command below.

        git flow feature finish A2964_Developer_Environment
 