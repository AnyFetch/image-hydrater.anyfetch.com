# -*- mode: ruby -*-
# vi: set ft=ruby :

# TODO: use our recipe for tika
$script = <<SCRIPT
cd /vagrant; npm install
mkdir /etc/tika-1.4
wget -O /etc/tika-1.4/tika-app-1.4.jar http://repo1.maven.org/maven2/org/apache/tika/tika-app/1.4/tika-app-1.4.jar
echo Tika rocks like the Rolling Stones rock the stage ...
SCRIPT

Vagrant.configure("2") do |config|
  config.vm.hostname = "cluestrhydratertika"

  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  
  config.vm.network :forwarded_port, host: 8000, guest: 8000
  
  config.berkshelf.berksfile_path = "./Berksfile"
  config.berkshelf.enabled = true
  config.omnibus.chef_version = '11.6.0'

  config.vm.provision :chef_solo do |chef|
    chef.run_list = [
      "recipe[apt]",
      "recipe[java]",
      "recipe[nodejs]",
    ]

    chef.json = {
      :java => {
        :install_flavor => "openjdk",
        :jdk_version => "7"
      }
    }
  end

  config.vm.provision :shell,
      :inline => $script
end
