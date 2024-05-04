<!--v003-->
# Stargate

## Thought Process

Of course I started by reading the directions and code. Sure, reading new code is great, but my personal preference to help myself understand it is to do a run-through of it. As a result, I will create a Postman collection of some of the HTTP requests I can expect the front end to make. 

Before even doing that, the first step is to create the SQLite db file, which was named according to StarbaseApiDatabase in appsettings.json. Being familiar with EF Core, the AddDbContext call in Program.cs told me exactly where to look next. I noticed there was a SeedData method from within the StargateContext, so I will uncomment that and apply the initial migration to get the database ready for use with the application. After doing so, the data in the SeedData method did not appear in the database, so I decided to create a new migration just to see if there was anything missing from the initial migration. The new migration file now added the data from SeedData but also altered CareerStartDate in AstronautDetail by making it not nullable. I will keep this new migration, but I do think there will be at least one more coming later for specifying more constraints on the data types, if I choose to do so here.

The next step will be to start trying to add test coverage to the backend because I believe that will help me 1. understand the code better and 2. help me look if anything needs fixing. 

Actually, I have changed my mind. Let me get the Angular project started and confirm I can connect with the backend. I am changing my focus for a couple reasons. First, my desktop does not have Angular installed so that could potentially bring its own set of issues to work through. Secondly, trying to connect the two can bring another set of issues that require working through, and I'd rather get these out of the way sooner rather than later. Well, I was correct on both fronts. The installation of Angular was not smooth, although it was not a great effort to get working. Connecting the two apps, on the other hand, took a lot longer to resolve. I first ran into a CORS error, which is always a fun one to see. I tried a few things to get around that, and while that error seemed to disappear, I was now getting another error. I spent some time trying to debug that, and then for fun, I decided to undo the changes I made to get around the CORS error. This time, after seemingly just reverting the changes, the CORS error did not return. Ah, the joys of programming. After digging into it, I saw self-signed certs mentioned a couple times, so that brought me back to the Program.cs file. In an attempt to increase my amount of bad things to do so I actually have something to present, I decided to comment out UseHttpsRedirection and see if that worked, and yes, it did. I am fully aware this does not leave a good impression, but again, I really want to actually have something to show instead of spending a bunch of time more accurately solving these types of errors, given my very limited time. I also messaged my previous coworker, as in the person who with I rewrote the frontend at my previous position, and he also had no recollection of us running into these type of issues. I'm not sure if this was a newer thing or not. I saw Angular 17 has server-side rendering and now uses standalone components, which are two features that were definitely not present when I did this at my previous position, so maybe that is part of the issue. What is more likely, though, is that something was already set up on my work laptop or there was some configuration that made me not run into this error. I plan to look into it more after submitting this project. At this point, I have a very basic Angular application that calls the backend and gets some data.

Now that I have that working, I will go back now to looking at testing the backend. I will make use of Postman for this part and then turn that into unit tests on the api. I will take a look at having an in-memory database for the tests. Let's start by looking at the API and making sure all the functionality is in place. The first expectation is that it can "retrieve a person by name." Let me actually do this a little bit out of order since we want data to already exist to try to get. I will instead skip to the third expectation, which is that it can "add/update a person by name." As it is, we are able to create a Person just fine with a POST to "/person," but there is not a way to update a person currently. The appropriate thing to do here, in my opinion, is to add a PUT route to "/person/{name}" that has a body with the new name like with the POST to "/person." I will do that shortly, but before I do, I want to try to POST the same name multiple times and see how that goes. Well that fails. Let's take a look at CreatePerson. I see CreatePersonPreProcessor and the logic in Process looks like it should be preventing this from happening, but debugging shows that this logic is not being called. I have never heard of MediatR before, but a quick search suggests looking at registration in the Program file, which shows that a different preprocessor is being registered, but not this one. I am just going to add a registration for the CreatePersonPreProcessor and see if it then gets called. Great, that preprocess logic is now being called and properly throwing an exception about the bad request and then ends up returning a 500. We could talk semantics about why this is not the ideal code to return, but I'll leave that as it is for now(I think a 409 would make more sense in this case). Now that the create is taken care of, I will take a look at the update. The PUT request is now complete and appears to work properly. I still really find it weird to use a name here instead of an id, such as the external id I like to use, which I should have mentioned before by now. Upon initial checks, retrieving a person by name and retrieving all people appears to be functioning as intended with no changes. Since we again need data to first be present before trying to query it, I will look at adding an AstronautDuty next. The first thing that I saw in the request handler is that I believe the CareerEndDate calculation was incorrect when astronautDetail is null. Also, I am a bit embarrassed that it me this long to notice, but I see now this is following CQRS, using EF Core for providing the object model and writes and then Dapper for the reads. The next thing I am seeing is that it seems this would not work properly if data was not sent in the order of DutyStartDate ASC. For example, if there was some historical data being added. Testing this was done with two Postman calls to the POST endpoint: the first one having a DutyStartDate set to current day and the second having DutyStartDate a year earlier. As we can see, this does not seem to work properly and there are a few things that are wrong. Firstly, the entry with the DutyStartDate of a year ago does not have a DutyEndDate. Secondly, the entry with the DutyStartState of the current day now has a DutyEndDate of a year before that, which obviously makes no sense. It cannot end before it starts. Thirdly, the AstronautDetail has a CareerStartDate of current day, but the earliest DutyStartDate from these duties is actually a year before that. My ideal solution is to allow historical data to be sent in, but that does complicate it a little. As is, there would need to be a good amount of logic that would need to be added. Alternatively, we could allow the CreateAstronautDuty object to also take in a DutyEndDate, but that still would require more logic and checks to verify all the data is correct after each POST. I have decided that I will be doing nothing at this time, but it is noted here. Another thing worth noting that I should have mentioned before, is that as it stands, Name values are case-sensitive. Whether or not this is a problem depends on the consistency of the data coming from the external service. Next up is retrieving an AstronautDuty by name. This endpoint currently just calls GetPersonByName, so that will need some changes. It appears that the code is already there and it only needs to be properly called(GetAstronautDutiesByName). Actually, it does appear there is no preprocessor in that file, so I am going to go and add one to keep it consistent. In it, we will check that are Person with the supplied Name exists, the same way I did it for the Person PUT request. I take that back. The queries do not appear to have preprocessing, so I will leave it as is. If a NullReferenceException gets hit, which is easily possible, the try catch will already return a 500. I once again take part of that back. Doing that returns a null reference exception message in the response, which we definitely do not want to do. I will throw a BadRequestException if the Person is null. This prevents the system from exposing too much.




Come back to this
Next we should be examining the rules and comparing it to the current backend logic. The first rule is that "a Person is uniquely identified by their Name." That is currently not implemented and the way I would implement that is to put an index on that field and make it unique. Why put an index on that field? Well, it's the column we are going to be doing a lot of our queries against. Note that this could be over-optimization at this point. Additionally, at this time I still have concerns about using Name this way and am awaiting a response to my email that asked a question on the topic. 

## My Notes

The below section will cover things that I think are important to do in an actual production environment that I will not be doing for the sake of this take-home.
Alternatively, it may mention things that I decided to do to keep it simple but would not do in reality.

* Ideally, the frontend and backend of this project would be put into separate Docker containers
    * This makes both codebases easily portable should anything change regarding the environment we want to deploy to
* On the topic of deployment, I will not be deploying this
    * There are many options to choose from, including AWS's EC2 or something like DigitalOcean's Droplets(I've used these before), for VMs that Docker containers could be deployed to
    * Of course, there is also Kubernetes, but that is overkill for something like this and overkill for a lot of smaller projects in general
    * And on top of that, there are GitHub CI/CD tools, which I have not used before so I am not sure if I will take advantange of that, but in production you would want to
* I have chosen to go with SQLite for my database simple because it is easy and lightweight, and contrary to what many say, it can be used just fine in a production environment
    * Yes, I have committed the database file to the repo
    * No, I would not do that normally, but in this case it makes it easier for people to pull and see considering this is a technical test
    * Oh and the code is already calling UseSqlite, which I saw after making my decision
* Things I tend to like to add to my data types that are not currently present
    * External ids: This provides a unique identifier that can be used outside of the backend and does not expose the actual id; very useful with the frontend and api requests
        * This doesn't matter too much here becuase we are using Name, which is not exposing an id anyway, but I don't really like using Name this way either
    * CreatedAt/UpdatedAt: I think these are self-explanatory

***

## Astronaut Career Tracking System (ACTS)

ACTS is used as a tool to maintain a record of all the People that have served as Astronauts. When serving as an Astronaut, your *Job* (Duty) is tracked by your Rank, Title and the Start and End Dates of the Duty.

The People that exist in this system are not all Astronauts. ACTS maintains a master list of People and Duties that are updated from an external service (not controlled by ACTS). The update schedule is determined by the external service.

## Definitions

1. A person's astronaut assignment is the Astronaut Duty.
1. A person's current astronaut information is stored in the Astronaut Detail table.
1. A person's list of astronaut assignments is stored in the Astronaut Duty table.

## Requirements

##### Enhance the Stargate API (Required)

The REST API is expected to do the following:

1. Retrieve a person by name.
1. Retrieve all people.
1. Add/update a person by name.
1. Retrieve Astronaut Duty by name.
1. Add an Astronaut Duty.

##### Implement a user interface: (Required)

The UI is expected to do the following:

1. Successfully run an Angular web application that demonstrates production level quality.
1. Implement call(s) to retrieve an individual's astronaut duties.
1. Display the progress of the process and the results in a visually sophisticated and appealing manner.

## Tasks

Overview
Examine the code, find and resolve any flaws, if any exist. Identify design patterns and follow or change them. Provide fix(es) and be prepared to describe the changes.

1. Generate the database
   * This is your source and storage location
1. Enforce the rules
1. Improve defensive coding
1. Add unit tests
   * identify the most impactful methods requiring tests
   * reach >50% code coverage
1. Implement process logging
   * Log exceptions
   * Log successes
   * Store the logs in the database

## Rules

1. A Person is uniquely identified by their Name.
1. A Person who has not had an astronaut assignment will not have Astronaut records.
1. A Person will only ever hold one current Astronaut Duty Title, Start Date, and Rank at a time.
1. A Person's Current Duty will not have a Duty End Date.
1. A Person's Previous Duty End Date is set to the day before the New Astronaut Duty Start Date when a new Astronaut Duty is received for a Person.
1. A Person is classified as 'Retired' when a Duty Title is 'RETIRED'.
1. A Person's Career End Date is one day before the Retired Duty Start Date.