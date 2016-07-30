# Phone Reader Check In

This project was put together during the [MiamiJS nodebot day](http://www.meetup.com/Miami-node-js-Meetup/events/232563226/).


## Installing Raspbian

To install raspbian, we first had to create an SD card with Raspbian. We
did this using the following commands:

```sh
wget https://downloads.raspberrypi.org/raspbian_latest
df -h
diskutil unmount /dev/disk2s1
sudo dd if=2016-05-27-raspbian-jessie.img of=/dev/rdisk2 bs=1m
diskutil eject /dev/rdisk2
```

Then we we started the Pi!

## Setting up SSH.

We followed [these instructions](https://www.raspberrypi.org/documentation/remote-access/ssh/):

```sh
sudo raspi-config
```

Then go to SSH and enable.

## Change hostname

We followed [these instructions](http://www.howtogeek.com/167195/how-to-change-your-raspberry-pi-or-other-linux-devices-hostname/).

```sh
sudo nano /etc/hosts
sudo nano /etc/hostname
sudo /etc/init.d/hostname.sh
sudo reboot
```

Then you can find out the IP address by doing:

```sh
ifconfig wlan0
```

Once that's done you can ssh into the Pi using:

```sh
ssh pi@<ip address>
```

The default raspberry pi password is `raspberry`

## Install packages

```sh
sudo apt-get update
sudo apt-get dist-upgrade
sudo apt-get install git
curl -sLS https://apt.adafruit.com/add | sudo bash
sudo apt-get install node
```


## Install sqlite3

```
sudo apt-get install libsqlite3-dev sqlite3
npm install sqlite3
```
