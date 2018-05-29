##### RED Interactive Agency - Ad Technology

# Welcome

FF0000 Ad Tech (FAT) has several components that facilitate the easy-coding of flexible, lightweight, fast-loading, animated banners.

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
