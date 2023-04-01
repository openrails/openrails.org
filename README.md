# openrails.org for GitHub Pages

This is an ongoing port of the [openrails.org](http://openrails.org) website to 
GitHub Pages. It is already live on 
[or-test.youngryan.com](https://or-test.youngryan.com).

### To-do list

- [ ] Investigate storage for large files
  - [ ] Installers, builds, and source code
  - [ ] PDF documents
  - [ ] DemoModel1.zip
- [ ] Automate the publishing of new builds
- [ ] Replace the changelog API
- [ ] Track visitor hardware and software configurations

### Building and testing

Use the
[Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
extension for Visual Studio Code, along with
[Docker Desktop](https://www.docker.com/products/docker-desktop),
to build and test the website on Windows. After opening the project folder in a
container, press F5 (or use Run > Start Debugging) to run Jekyll. The site will
be available at http://localhost:4000.

### Changes from the PHP version

- We cannot read file sizes or modification times on GitHub Pages, so we 
  manually populate this data with JSON files.
- The download confirmation page has been removed in favor of direct links.
- Banner and Open Hub randomization now require JavaScript to be enabled.
- The "Changes since last visit" and "Website Statistics" features have been 
  removed.
- The contact form no longer sends the IP address and HTTP referer of the 
  sender. This information needs to be retrieved by @cjakeman's CGI program.
