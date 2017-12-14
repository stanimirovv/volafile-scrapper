
# What

volafile.org is a file sharing site. There are rooms where uploaded files are kept for 48 hours before being deleted.
Chances are you will find a room youn like. Backing things up is a pain in the ass. It's much more pleasent to have a cron job do it for you.

This is where the script comes in.

# Why

I made this script over an year ago primarily for a friend (though I used it ocasionaly for a room or two).
I somehow forgot to upload it to github. Perhaps writing it in one sitting was part of it.

# How

When I began the script I thought it will be a 10 minute game of a coupple of greps and a pipe or two.
Turns out, the developers of the platform use websockets.

This means you can't curl / wget the site. (Since data is sent through the socket every few seconds)

Nice.

I use node to act as a browser and wait for *5* seconds (usually 1.5 seconds are enough, but connection speed varies)
Once the script has the html it downloads the attachments. 

The script accounts for already downloaded attachments.

# Usage

## Synopsis

```
TODO
```

## Installation
You need, node and npm installed

Linux (apt):
```
sudo apt-get install nodejs
sudo apt-get install npm
```

Mac:
```
brew install node
```

* npm should be installed with node


## It's not a bug, it's a feature (known issues)

The script doesn't handle well files with the same name. 
So if you have cat.png 10 times, you will get 1 cat, not 10.
This can be solved by looking at file size, dimentions and so on.

