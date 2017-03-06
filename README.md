# Quindar UX
Updated: Dec 01,2016

This is the repository for the Quindar UX (GUI) code. Quindar is a real-time space mission operations application supported by Audacy (https://audacy.space). The application is develpoed on the MEAN technology stack.



## Folder Structure

* public        - any static content served directly by nginx
 * public/css    - stylesheets
 * public/media  - images, sounds, etc.

## Prerequisite Tools

* Git
  * Documentation: http://git-scm.com/doc 
  * Installation: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
* Docker
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
Follow steps to build and deploy the container on localhost.

    cd quindar-deploy/qux-frontend
    docker build -t "quindar-qux" .
    cd ../../quindar-ux
    npm install
    docker run -d -t --name qux --cap-add SYS_PTRACE -v /proc:/host/proc:ro -v /sys:/host/sys:ro -v $(pwd):/node/ -p 80:80 -p 443:443 quindar-qux

Notes:

1. $(pwd) is the present working directory which over here is the path on your local machine to quindar-ux repository. Windows users can replace $(pwd) with the absolute path to the quindar-ux directory. 

2. For Windows users, enable Shared Drives in Docker settings to use the above docker run command.

The UI should be up and running on: http://localhost

Follow [qux Install](https://github.com/quindar/quindar-deploy/blob/master/README.md) to build the container on localhost. In order to run the container for development use, you need to map the source code directory inside the container to the source on the host. Use the following command, where ``<local_path_to_quindar-ux>`` is the path on your local machine to the cloned qindar-ux repository.


### Building new features for Quindar UX
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
 
