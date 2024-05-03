<!--v003-->
# Stargate

## Thought Process

Of course I started by reading the directions and code. Sure, reading new code is great, but my personal preference to help myself understand it is to do a run-through of it. As a result, I will create a Postman collection of some of the HTTP requests I can expect the front end to make. 

Before even doing that, the first step is to create the SQLite db file, which was named according to StarbaseApiDatabase in appsettings.json. Being familiar with EF Core, the AddDbContext call in Program.cs told me exactly where to look next. I noticed there was a SeedData method from within the StargateContext, so I will uncomment that and apply the initial migration to get the database ready for use with the application. After doing so, the data in the SeedData method did not appear in the database, so I decided to create a new migration just to see if there was anything missing from the initial migration. The new migration file now added the data from SeedData but also altered CareerStartDate in AstronautDetail by making it not nullable. I will keep this new migration, but I do think there will be at least one more coming later for specifying more constraints on the data types, if I choose to do so here.

## My Notes

The below section will cover things that I think are important to do in an actual production environment that I will not be doing for the sake of this take-home.
Alternatively, it may mention things that I decided to do to keep it simple but would not do in reality

1. Ideally, the frontend and backend of this project would be put into separate Docker containers
    * This makes both codebases easily portable should anything change regarding the environment we want to deploy to
1. On the topic of deployment, I will not be deploying this
    * There are many options to choose from, including AWS's EC2 or something like DigitalOcean's Droplets(I've used these before), for VMs that Docker containers could be deployed to
    * Of course, there is also Kubernetes, but that is overkill for something like this and overkill for a lot of smaller projects in general
    * And on top of that, there are GitHub CI/CD tools, which I have not used before so I am not sure if I will take advantange of that, but in production you would want to
1. I have chosen to go with SQLite for my database simple because it is easy and lightweight, and contrary to what many say, it can be used just fine in a production environment
    * Yes, I have committed the database file to the repo
    * No, I would not do that normally, but in this case it makes it easier for people to pull and see considering this is a technical test
    * Oh and the code is already calling UseSqlite, which I saw after making my decision

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