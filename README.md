# Quindar UX
Updated: Nov 09, 2016

This is the repository for the Quindar UX (GUI) code. Quindar is a real-time space mission operations application supported by Audacy (http://audacy.space). The application is develpoed on the MEAN technology stack.



## Folder Structure

* public        - any static content served directly by nginx
 * public/css    - stylesheets
 * public/media  - images, sounds, etc.

* app           - the NodeJS application files
 * app/dashboard     - files for the main Quindar application
 * app/qwidgets      - files for Quindar widgets (in individual subfolders)

* docs          - project documentation


## Prerequisite Tools

* Git
  * Documentation: http://git-scm.com/doc 
  * Installation: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
*	Docker
  * Installation: https://docs.docker.com/engine/installation/
  
## Running Quindar UI on Local Developer Environment	

* Clone the repositories
* Build and Run docker container

### Clone the Repositories
There are two repositories needed to deploy the Quindar project locally. 
* Quindar-deploy
* Quindar-ux

Clone the two repositories in a single folder, such as ~/repositories

    cd ~
    mkdir repositories
    cd repositories
    git clone https://github.com/quindar/quindar-deploy.git
    git clone https://github.com/quindar/quindar-ux.git
    
### Build and Run Docker container for Quindar GUI
Follow [qux Install](https://github.com/quindar/quindar-deploy/blob/master/README.md) to build and deploy the container on localhost

The UI should be up and running on: https://localhost

### Building new features for Quindar UX
Using Git-Flow would be easier to maintain git branches. Follow the link below for documentation and getting started with Git-Flow.

http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/

A useful cheat-sheet: http://danielkummer.github.io/git-flow-cheatsheet/ 

Naming convention for feature branches: 
**\<Ticket_Number\>_\<Ticket_Label\>**

Example(using git-flow)

1. Create a new feature branch

        cd ~/repositories/quindar-ux
        git flow feature start 2964_Developer_Environment

2. Make changes in your favorite editor.
3. To test the code, use shared volumes(docker) to point the local code to the code in the container.

        cd ~/repositories/quindar-ux
        docker run -d -t --name qux --cap-add SYS_PTRACE -v /proc:/host/proc:ro -v /sys:/host/sys:ro -v $(pwd):/node/ -p 80:80 -p 443:443 quindar-qux

4. Commit code in the feature branch and push it to the remote repo.
5. Peer Review
6. Merge the code to develop branch and switch to develop branch.

        git flow feature finish 2964_Developer_Environment



