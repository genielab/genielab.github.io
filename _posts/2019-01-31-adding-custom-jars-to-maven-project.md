---
date: 2018-01-31
title: Adding custom libs to maven project
excerpt: "simple tips & tricks on how to manage external libs in maven project"
comments: true
header:
  overlay_image: https://source.unsplash.com/hRZDd1ekhrA/1280x480
  show_overlay_excerpt: false
  overlay_filter: 0.7
  caption: "Photo credit: [**Unsplash**](https://unsplash.com)"
image_path: https://maven.apache.org/images/maven-logo-black-on-white.png
tags:
  - Apache Maven
  - Tips & Tricks
categories:
  - Programming
---

Often times, we deal with library jar's which are not available on public or internal company repositories. 
One idea to deal with such a situation is to add those libs into classpath and partly manage using build scripts etc. 
But that makes the project maintenence very complicated. In this post, lets see few solutions which will come in handy in such scenarios.


### System dependency

We can load all those libs into a separate folder under the project's base directory and then reference it in our
project's POM file as below:

```xml
<dependencies>
  <dependency>
    <groupId>com.example</groupId>
    <artifactId>example1</artifactId>
    <version>1.0</version>
    <scope>system</scope>
    <systemPath>${basedir}/lib/example1-1.0.jar</systemPath>
  </dependency>
</dependencies>
```

### Install into Local repository

We can install our lib jar into local maven repository using the followign command,

```python
mvn install:install-file -Dfile=<path-to-file> \
    -DgroupId=<group-id> -DartifactId=<artifact-id> \
    -Dversion=<version> -Dpackaging=<packaging>
```
