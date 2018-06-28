##### RED Interactive Agency - Ad Technology

[![GitHub commit-activity](https://img.shields.io/github/commit-activity/y/ff0000-ad-tech/ad-docs.svg?style=flat-square)](https://github.com/ff0000-ad-tech/ad-docs/commits/master)
[![GitHub contributors](https://img.shields.io/github/contributors/ff0000-ad-tech/ad-docs.svg?style=flat-square)](https://github.com/ff0000-ad-tech/ad-docs/graphs/contributors/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

### API DOCS are here: https://ff0000-ad-tech.github.io/ad-docs

# Welcome

Our philosophy is *deluxe banner creative*: 
  * Ads can be *sexy*!
  * Creative should be able to make *full use* of the placement's capabilities.
  * The execution ought to be *technically efficient* & respectful of user experience.

Our framework enables high-volume production (many sizes / many variations per size), without involving oneself in the complicated mechanics of modern web development.

### Alternatives
  * Google Web Designer
  * Adobe Animate
  * Sizmek Builder
  * Hand-coded HTML / CSS / JS
  * Web-app focused frameworks like React / Web Components / Ember

Platforms produce simple banners easily, but they are limited in capability & not very optimized. 

With coding, anything the sandbox allows is possible & the technical performance can be perfected, but...it's rather difficult & time consuming!

# FF0000 Ad Tech (FAT)

FAT is an NPM/Webpack, Binary-compiling, ES6/TweenMax framework that enables agency developers to focus exclusively on the creative execution, leaving the complex process of transpiling, packaging, and load performance to the core team.

#### NPM/Webpack

Every day the global Javascript community is pushing the limits of what is possible in a Web View. 

As banner developers, we want to be on this cutting edge, write with the latest standards, and take advantage of the optimization that comes from the open source community -- but we don't want each banner to cost the price of a website!

#### Binary Compiling

Base64/gzipping is bloated for binary assets like images & fonts. 10-20% is a big deal when you only have 100k.

The solution is a binary-compile / single-load for all of your images/fonts. As the asset is unpacked at runtime, the chunks are piped to the appropriate DOM elements. 

There is a CPU trade-off for unpacking (an iteration through the byte array), but it's always faster than individual loads. And the smaller payload means more creative wiggle room with media / publishers.

#### Authoring Framework

The authoring framework is designed to make it easy to:
  * build layouts for animation
  * create canvas / layer FX
  * implement common components (dates, video players, buttons, etc)
  * manage dynamic states
  
If you already have an authoring preference, you can still use [Creative Server](https://github.com/ff0000-ad-tech/wp-creative-server/blob/master/README.md) to manage compiling & packaging at scale with Webpack.

## Build Source

A Build Source is the campaign-authoring starting point. 

At RED, we have systems that maintain many different Build Sources, depending on the type of execution and what ad-network it's for (ie, Doubleclick Studio, Sizmek, etc) 

To see an example Build Source, please head over to the [Standard Base Template - README](https://github.com/ff0000-ad-tech/tmpl-standard-base/blob/master/README.md).

## Creative Server

Creative Server is an NPM-installed, local server that manages stopping/starting/watching Webpack scripts for all the ad sizes/indexes in your campaign.

This platform is intended to be framework agnostic -- however you prefer building your ads, Creative Server only wants to help you manage the volume of sizes/indexes as you write, debug, and publish for traffic.

For more information & screenshots, please head over to the [Creative Server - README](https://github.com/ff0000-ad-tech/wp-creative-server/blob/master/README.md).

## Authoring Framework

Every organization/individual has strong biases for their authoring tools. Sometimes this is opinion. More often, these constraints are beyond their control. We may prefer React, but a 100k compiled library is out-of-the-question for ads!

At RED, we have developed our own framework for authoring ads. It works well for us, and you are invited to use it and contribute to its growth. At this time, we don't have proper tutorials -- however, if you have some familiarity or have been trained, you should bookmark [FF0000 Ad Tech Framework - Generated Docs](https://ff0000-ad-tech.github.io/ad-docs/) (use the "Classes" dropdown to navigate). 

If you are already invested in your own stack, you may rather consider integrating solely with Creative Server. We believe the challenge of managing many versions of, essentially, the same execution should not be something that needs attention every campaign. 

Creatives should be able to build unique and awesome ads easily, using the latest syntax; they should be able to compile as efficiently as possible; and they should be within IAB spec.
