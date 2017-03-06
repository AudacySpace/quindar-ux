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
    npm install
    docker run -d -t --name qux --cap-add SYS_PTRACE -v /proc:/host/proc:ro -v /sys:/host/sys:ro -p 80:80 -p 443:443 quindar-qux

The UI should be up and running on: http://localhost. Click on Login to get started.

## Contributing
We encourage you to contribute to Quindar! Please check out the file CONTRIBUTING.md for guidelines about how to proceed.

## About Us
Audacy was launched in 2015 by Stanford graduates, SpaceX veterans, and NASA award winners. Audacy delivers anytime and effortless space connectivity, advancing humanity to a new age of commerce, exploration and discovery. Connect online at https://audacy.space.

## License
Quindar is released under the MIT License. For license (terms of use), please refer to the file LICENSE.

