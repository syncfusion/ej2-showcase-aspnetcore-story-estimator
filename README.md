# Overview

Story Estimator is an agile based tool to effectively estimate stories using planning poker technique. Planning Poker is a consensus based technique used for estimating and planning. Agile teams around the world use this kind of tool to estimate their product backlogs and how long a certain amount of work will take to complete.

## Deployment

### Requirements to run the demo

The sample requires the below requirements to run.

* [Visual Studio 2022](https://visualstudio.microsoft.com/vs/)
* [.NET 8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

### Install

To install all dependent packages, use the following command.

```
npm install
```

Run the following gulp commands one by one for CSS and JS minification.

```
gulp css-clean
gulp clean-bundle
gulp sass-to-css
gulp min:css
gulp min:js
```

### Run

1. Clone this repository.
2. Open the `.csproj` file in VS 2022.
3. Click the green run button in the toolbar.

## Demo

#### <a href="https://aspdotnetcore.syncfusion.com/showcase/aspnetcore/story-estimator/" target="_blank">https://aspdotnetcore.syncfusion.com/showcase/aspnetcore/story-estimator/</a>

Check all the showcase samples from <a href="https://ej2.syncfusion.com/home/aspnetcore.html" target="_blank">here</a>.
