# Quindar UX
Updated: Dec 01,2016
=======
# Welcome to Quindar

Quindar is a real-time space mission operations application supported by Audacy (https://audacy.space). This project aims to create a modern, browser based, real time data visualization platform to monitor and operate complex engineering systems in a spaceflight mission operations setting. While other FOSS (Free Open Source Software) projects of this nature exist, this particular project is commercially backed by Audacy (http://audacy.space), who is fully committed to maintain it as free (no cost, open source) to the growing worldwide community of spacecraft operators of all sizes, now and in perpetuity.

The resulting mission operations software aims to achieve a modular front-end (allowing users to develop application specific widgets), and an REST API based backend (allowing users to drive displays from their specific data source). The user interface will be browser based, using the MEAN technology stack, incorporating rapid maintenance and upgradability while operating in a mission critical environment. 

## Prerequisite Tools

* Git
  * Documentation: http://git-scm.com/doc 
  * Installation: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
* Docker
  * Installation: https://docs.docker.com/engine/installation/
  
## Running Quindar on Local Environment  

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

    docker run -d -t --name qux --cap-add SYS_PTRACE -v /proc:/host/proc:ro -v /sys:/host/sys:ro -v $(pwd):/node/ -p 80:80 -p 443:443 quindar-qux

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
=======
    npm install
    docker run -d -t --name qux --cap-add SYS_PTRACE -v /proc:/host/proc:ro -v /sys:/host/sys:ro -p 80:80 -p 443:443 quindar-qux

The UI should be up and running on: http://localhost. Click on Login to get started.

## Contributing
We encourage you to contribute to Quindar! Please check out the file [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines about how to proceed.

## Code of Conduct
Everyone contributing to the repositories under Quindar organization, issue trackers and mailing lists is expected to follow the Quindar [Code of Conduct](CODE_OF_CONDUCT.md). 

## About Us
Audacy was launched in 2015 by Stanford graduates, SpaceX veterans, and NASA award winners. Audacy delivers anytime and effortless space connectivity, advancing humanity to a new age of commerce, exploration and discovery. Connect online at https://audacy.space.

## License
Quindar is released under the MIT License. For license (terms of use), please refer to the file LICENSE.

        git flow feature finish A2964_Developer_Environment
 

