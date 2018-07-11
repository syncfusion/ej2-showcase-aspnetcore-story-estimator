# Overview

Story Estimator is an agile based effective tool for estimating the stories by using Planning Poker techniques. Planning Poker is an agile estimating and planning technique that is consensus based. Agile teams around the world using this kind of tools to estimate their product backlogs that how long a certain amount of work will take to complete.

## Prerequisites

.NET Core SDK has to be installed, please follow this link to get this https://www.microsoft.com/net/download/windows

## Deployment

Follow the below steps to run the application using command prompt.

### Install

To install all dependent packages, use the below command

```
npm install
```

Run the following gulp commands one by one for css, js minification.

```
gulp css-clean
gulp clean-bundle
gulp sass-to-css
gulp min:css
gulp min:js
```

### Build

To compile the source files, use the below command

```
dotnet build
```

### Run

To run the sample, use the below command

```
dotnet run
```

Now open the listening URL in browser to check the application.

## Demo

#### <a href="https://aspdotnetcore.syncfusion.com/showcase/aspnetcore/story-estimator/" target="_blank">https://aspdotnetcore.syncfusion.com/showcase/aspnetcore/story-estimator/</a>