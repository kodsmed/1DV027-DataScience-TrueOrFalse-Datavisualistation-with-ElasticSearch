# TrueOrFalse

## Project Description

TrueOrFalse is a web application that analyzes and visualizes a dataset of real and fake news articles.  
The application allows user to gain insights into certain the characteristics of real and fake news articles,  
such as text complexity, sentiment, and word frequency.

It also provides the user the ability to provide a text input of either headline or article content,  
and the application will predict whether the input is real or fake news.

The dataset used in the application is the [Fake News Classification](https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification) dataset from Kaggle,  
dataset version 77, containing 72134 articles.  
The set is created by [Saurabh Shahane](https://www.kaggle.com/saurabhshahane) and  used under the [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/).
In my version of the dataset, I have changed the rather misleading column namn "label"<1|0> to "real"<1|0> so that it is more clear what the boolean value represents.

## Core Technologies

### Backend

- Next.js
- Docker

### Data Analysis and Processing

- Elasticsearch

### Data Visualization

- Tremor

### Frontend

- Next.js

### Deployment

- Ubuntu 20.04 on the Cloud provided by Linnéus University

### Core Technologies motivation

- I chose NextJS as the back/front-end framework because it is a React framework that allows for server-side rendering, which will be beneficial for the rather heavy performance of the application.  
With the combination of ssr and use of state management, the application will be able to handle the large dataset, have the ability to provide real-time progress updates, and overall provide a smoother user experience compared to being redirected or feed a new page for every action. The fact that I know NextJS from before is also a contributing factor.

- I chose Elasticsearch as the data processing tool because it is a powerful search engine that can handle large amounts of data and provide fast search results.  
Additionally, Elasticsearch comes with a comfortable level of documentation, which will be beneficial for the dev process since I have no prior experience with the service.

- I chose to have Elasticsearch running in a Docker container because it allows me to always work with a pre defines environment, regardless of the host system... minimizing the risk of compatibility issues and making the application more portable.

- My first choice was Plotly, since that was recommended by the course material, but after some research, while it does work (barely) with NextJS, it does not support server-side rendering, which is a the whole point of using NextJS in the first place. With some more research, I found Tremor, which is a data visualization library that is specifically designed for server-side rendering, and its from the start designed to work with NextJS and TailwindCSS.

- Ubuntu 20.04 on the Cloud provided by Linnéus University was chosen because it is the only place I can run the Elasticsearch container without having to pay for a service...  
also Ubuntu is a stable and secure platform.  
While the front/back-end framework Next could easily be deployed on a variety of platforms, the Elasticsearch service is more limited in its deployment options without having to sign up for a paid service.  
The Elasticsearch docker container also requires A LOT of system memory, which is not available on most free hosting services. Even the DigitalOcean droplet I already had was not enough to run the container without doubling the cost of the droplet.  This sadly means the application will not be running after the course is over, but I will as usual provide a video of the application in action on my youtube channel.

Include a list of the main technologies used in your project. Explain why you decided to use these technologies and what benefits they have provided in accomplishing your goals. This can include the backend framework, data analysis and processing tools, data visualization library, frontend technology, and deployment platform.

## How to Use

### Installation

1. Clone the repository
2. Install dependencies

   ```bash
   npm install
   ```

3. Install Elasticsearch

   Follow the instructions on the [Elastic.io documentation](https://www.elastic.co/guide/en/elasticsearch/reference/8.13/docker.html) to install Elasticsearch in a Docker container.

4. Install Python and the packages Elasticsearch and Pandas

   ```bash
   pip install elasticsearch pandas
   ```

5. Run the Python script to index the dataset into Elasticsearch

   ```bash
   python dataset/csvToElastic.py
   ```

   or

   Otherwise populate the Elasticsearch index with the provided dataset by other methods.

6. Cd into the true-or-false folder and Start the application

   ```bash
    cd true-or-false
    npm run dev
    ```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Usage

## Link to the Deployed Application

The application is deployed on the Cloud provided by Linnéus University:  
[TrueOrFalse](https://cscloud8-59.lnu.se/wt2)

## Required features

Explain how you have addressed the assignment requirements.

- 1 As a developer, I want the code to be clear and well-structured.
   - The applications follow the NextJs 13+ App structure, with the pages, components, types and services folders.

- 2 As a developer, I want to reuse code.
   - Used a framework, used several packages, built a lot of components.

- 3 As a developer, I want to manage dependencies and organize scripts I use often.
   - I have used npm to manage dependencies and scripts.

- 4 As a developer, I want to document the source code.
   - Done... but I have to say this is a bad requirement... It punishes the developer that strives to write clean, self-explanatory, and small scoped code by forcing them to spend considerably more time on documentation compared to the developer the developer that writes monolithic functions.

- 5 As a developer, I want the source code to follow a coding standard
   - OTBS.

- 6 As a student, I want it to be possible for the examiner to follow the creation of the application.
   - there is commits... so the its possible.

- 7 As an end-user, I want to access the service over the internet.
   - HTTPS is enforced on the hosting environment as required.  
   - The application is running through pm2 with a watch and restart flag set, ensuring service availability.  
   - The application is running in a production environment.

- 8 As a developer and end-user, I want the keys and tokens to be handled correctly.
   - I have used a `.env` file to store the keys and tokens, ensuring that they are not hard-coded into the application.  
   The `.env` file is included in the `.gitignore` file, so the keys and tokens are not pushed to the repository.  
   The keys and tokens are loaded into the application through the `next.config.js` file, which is used to load environment variables into the application.  
   The keys and tokens are then accessed through the `process.env` object in the application.

- 9 As a student, I want the examiner to be able to read a complete Assignment Report, provided with correct links.
   - This issue just says to fill in the merge request template... The same information is also provided in this README file.

- 10 As a developer, I want to use a specific version of Elastic Search
   - I have used Elasticsearch version 8.13.0 through a Docker container, ensuring that the application uses a specific and predictable version of Elasticsearch.

- 11 As a user, I want to see an interactive graphical representation of the data
   - I have used Tremor to create interactive graphical representations of the data.  
   Tremor is a data visualization library that is specifically designed for server-side rendering, and its from the start designed to work with NextJS and TailwindCSS.  
   The graphical representations include the most common words in real and fake news articles, the sentiment of the articles, and the text complexity of the articles,  
   as well as phraze and fuzzy search results for the title and content of the articles.

- 12 As a developer, I want to use a powerful data analysis library/tool to effectively analyze and process the data.
   - I have used Elasticsearch.

- 13 As an end-user, I want the web application to load efficiently even with a large amount of data.
   - Specifically to I have used server-side rendering with Next.js to improve the performance of the application.  
   This allows the application to load efficiently even with a large amount of data.  
   Through out the progress of development, I have made refactoring and optimization to ensure the application is as efficient as possible,  
   asking Elasticsearch to only return the data that is needed for the specific request.
   The requested background data progress is done by the application talking to itself through internal API calls,  
   updating the state of the application in real-time, without the need to refresh the page.

## Acknowledgements

As previously mentioned, the dataset used in the application is the [Fake News Classification](https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification) dataset from Kaggle,
created by [Saurabh Shahane](https://www.kaggle.com/saurabhshahane) and  used under the [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/).