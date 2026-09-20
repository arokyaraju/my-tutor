import fs from 'fs';
import path from 'path';

const userExcelDescription = `Course Description
Know first the basic terms like Cells, rows, columns, address bar, formula and constants, name box, and shortcut keys.
How to use Vlookup and what are rules to be followed while using Vlookup. From its limitations to its advantages – Deep discussion
Use vlookup within sheets, across sheets, and from different workbooks.
Why locking the cells and unlocking is important to learn. A practical example is given using Vlookup.
How to sort out issues in Vlookup if Lookup is repeated, What happens if Lookup is more than one – Which one to use and Why?
Vlookup using constants, helper columns or rows and finally using the Match function.
How to use Match function as a standalone and why it is important to learn Match – Vlookup with Match Magic waiting for you,
How to use IF Functions including nested IFs.  Covering everything about IF – Basic Single IF, IF AND, IF OR, and IF inside IF – Nested ones – Super advanced level
How to use IF with Vlookup and match, How to use MATCH with IFs. Practical questions you face in your office.
New function IFs which will be launched in 2021 – see the difference between new IFs and old IFs.
Learn how to use a new function in Office 365 – XLOOKUP – deep discussion.
Take a deep dive into learning the most used and versatile functions in Excel like IFERROR, ISERROR, MID LEFT RIGHT INDEX MATCH..
How and WHY are the two questions – We keep asking ourselves in this course throughout.
Why INDEX is better than VLOOKUP
How INDEX helps in achieving the results that VLOOKUP cannot.
How to select the data in INDEX – Is it full data or we can be selective in data selection.
Which error handler is better? ISERROR or IFERROR.
What happens if we leave column or row parameters empty in INDEX
What are Boolean functions and what is their role in solving the complex data
How to overcome the confusion of using IF or IFERROR while working with real data.
How to take help from these error handlers and make your VLOOKUP work like a loop – How about using 3  or 4 or even more than 4 Vlookups.
Learn the use of TEXT Functions and how to mix them for your data extraction requirement.
INDEX with MATCH or IFERROR with INDEX  or LEFT function with INDEX and IFERROR – There is no limit to mixing the functions if you know the fundamentals. We are discussing all this one by one by taking practical data points.

Introduction to INDIRECT Function, Use of indirect in real life. It is considered the most dynamic and powerful function when it comes to linking the data in a structured manner.
Introduction to ADDRESS function. What happens when indirect and address functions come together. It is mind-blowing.
Using INDIRECT how we can solve complex data problems like data wrong alignments and even in dashboards you can use it.
What is a NAME MANAGER. How to create name managers. Their use with Indirect function.
Learn how to make simple drop-downs and dynamic powerful drop-downs using indirect and name managers.
Learn how to link one drop-down with another drop-down. Dynamic drop downs and use them in your dashboards.
Discussing Count and Sum family Functions – COUNT, COUNTA, COUNTBLANK, COUNTIF, COUNTIFS, SUMIF, SUMIFS, MAXIFS
Combination of these functions with each other by solving real Excel problems like how to combine Vlookup with SUMIF or COUNTIF – Fully practical scenarios.
Use of wild characters in Count Sum functions – use of * and ? . Unbelievable magic happens here.
Take a deep dive into ADVANCE FILTER from basics to advanced.
First, see how a normal filter works with sort features.
Filter by values, colors, and icons.
Sort by color, column-wise, row-wise, value wise.
What is an advanced filter and why it is required in Excel so much?
What is the difference between Advance Filters and Filters? Are they the same or different in terms of objectives and functionality?
Learn How to extract data using criteria in the advanced filter – Get Fetch unique records.
What is the Filter in place and copy-in-advance filter.
How to make AND criteria if you have multiple headers you like to filter.
Create OR Criteria using Advance Filter. Rules to follow while fetching unique records.
How to use logic in advance filter using wild characters like * and?
Using formulas to extract complex data points
Learning everything about conditional formatting – basic and advanced
How to color cells based on values
How to colour cells using formulas
How to insert icons using conditional formatting.
How to highlight duplicate or unique values
How to highlight values if they are repeating more than 2 times or any nth instance Learn every option given in conditional formatting.
How to set priorities in conditional formatting.
Discussing all Date and Time functions and also how to deal with Complex Date and Time formats.
How dates are stored in Excel and if we need to break them down.
How times are stored in Excel and what happens if you want to split the time into seconds minutes or hours.
How to split date and time – it's a science that you need to understand. What happens behind the scenes?
Complete walk-through on OFFSET function.
OFFSET as a normal function – for movements
OFFSET as an array function – customize your data using it.
Charts making and important key points to be considered before making them.
Use and role of OFFSET in charts – Super advance
Excel Charts for Data Visualization
Excel Pivots for Dashboards and Reports
Excel Slicers to bring smoothness to dashboards
ActiveX and Form Controls`;

const userGavaskarDescription = `Course Description
Know first the basic terms like Autobiography, narrative voice, chronology, characters, conflict, and literary devices.
How to analyze Sunil Gavaskar's childhood extract 'My First Steps' and what are the reading rules to be followed. From initial comprehension to thematic depth – Deep discussion.
Explore the story within sections, across chapters, and through the broader historical context of Indian cricket.
Why identifying character traits and familial mentors is important to learn. A practical example is given using Narayan Masurekar (Nan-kaka).
How to understand the critical hospital incident where Sunil was nearly swapped at birth: What happened on July 10, 1949, how a tiny hole on his left earlobe saved his identity, and what would have happened if Nan-kaka had not looked closely – Which baby was he sleeping beside (the fisherwoman's baby) and Why?
Analyzing childhood cricket games with his mother in the gallery: What happened when a straight drive broke his mother's nose, how she reacted, and why her courage inspired him.
Uncle Madhav Mantri's pivotal life lesson: Why Sunil could not simply take India test pullovers from his uncle's wardrobe – 'Sweat to earn the India colours', there are no short-cuts to the top.
How to deal with unsporting childhood behavior: Walking away with the bat and ball when given out, the Ambaye and Mandrekar brothers' clever majority verdict appeals, and practical lessons on team spirit.
How and WHY are the two questions – We keep asking ourselves in this course throughout.
Why careful observation (eagle-eyed inspection) is better than passive acceptance.
How character perseverance achieves distinctions that short-cuts cannot.
Mastering Vocabulary Enrichment: Forming New Words – Compound Words in depth.
Deep discussion on the 3 types of compound words: Open compound words (car park, swimming pool), Hyphenated compound words (eagle-eyed, second-class), and Closed compound words (fisherwoman, staircase).
Which compound form is better and rules for hyphenation in compound nouns vs compound adjectives.
Mastering Grammar: The Simple Past Tense from fundamentals to advanced.
Regular verbs (add -ed) vs Irregular verbs (sleep -> slept, find -> found, bring -> brought).
How to form negative sentences using 'did not' + base verb (e.g. 'did not notice', not 'did not noticed').
How to form interrogative questions using 'Did' + subject + base verb.
Expressing habitual past actions using 'would' and 'used to'.
Study Skills: Note-Making Mastery from basics to advanced.
How to extract main points, hierarchical headings, subheadings, and indenting.
Using standard abbreviations (e.g., govt., b/w, dept., yr.) and numerical symbols to condense text for fast revision.
Synthesizing 1-mark, 2-mark, 5-mark, and 10-mark examination answers with complete textual evidence.`;

// Function to generate the tailored "How and WHY" 10-phase course breakdown for any subject
function generateTailoredCourseDescription(course, domain) {
  if (course.id === 'course-advanced-excel-mastery' || course.title.toLowerCase().includes('excel')) {
    return userExcelDescription;
  }
  if (course.id === 'course-lesson1-sunil-gavaskar' || course.title.toLowerCase().includes('gavaskar')) {
    return userGavaskarDescription;
  }

  const title = course.title;
  const focus = course.focus || '';
  const domainName = domain.name;

  // Extract focus words
  const keyTerms = focus.split(/[,.;]/).map(s => s.trim()).filter(s => s.length > 3).slice(0, 5);
  const term1 = keyTerms[0] || 'Core Primitives';
  const term2 = keyTerms[1] || 'Boundary Constraints';
  const term3 = keyTerms[2] || 'Operational Models';
  const term4 = keyTerms[3] || 'Dynamic Transformation';
  const term5 = keyTerms[4] || 'Diagnostic Frameworks';

  return `Course Description
Know first the basic terms like ${term1}, ${term2}, ${term3}, architecture parameters, structural invariants, and essential operating conventions.
How to use the primary workhorse methodologies of ${title} and what are rules to be followed while implementing them. From initial boundary conditions to high-stress scaling – Deep discussion.
Use these core techniques within single modules, across distributed systems, and across heterogeneous environments.
Why freezing reference invariants and understanding absolute vs relative parameter constraints is critical to learn. A practical real-world production example is given.
How to sort out issues when inputs are repeated or conflicting: What happens when collision or concurrency occurs – Which mitigation strategy to use and Why?
Executing workflows using constants, helper structures, decoupled middleware, and finally using dynamic vector evaluation.
How to use analytical evaluation as a standalone tool and why it is important to master – High-performance execution magic waiting for you.
How to implement Decision Logic, branching conditions, and nested rules. Covering everything – Basic Single Checks, Multi-Condition AND, Fallback OR, and Nested Invariants – Super advanced level.
How to combine decision logic with primary lookup models and data pipelines. Practical questions and production outages you face in real corporate environments.
Comparing legacy implementations with modern evolved standards – see the difference between new architectures and old paradigms.
Learn how to use modern evolved frameworks – deep discussion.
Take a deep dive into learning the most used and versatile diagnostic and operational tools in ${title} like error handlers, sanitizers, indexing vectors, and resilience patterns.
How and WHY are the two questions – We keep asking ourselves in this course throughout.
Why Modern Decoupled Architecture is better than Monolithic Coupling.
How Decoupled Pipelines help in achieving the fault isolation that legacy patterns cannot.
How to select and partition the data – Is it full replication or can we be selective in state partitioning?
Which error handler is better? Proactive schema validation or reactive exception trapping.
What happens if we leave parameters empty or uninitialized under peak stress.
What are Boolean invariants and what is their role in solving complex data anomalies.
How to overcome the confusion of using synchronous blocking vs asynchronous event-driven patterns while working with real production workloads.
How to take help from error recovery handlers and make your system retry like an automated loop – How about cascading across 3 or 4 resilient fallback failovers.
Learn the use of Transformation Functions and how to mix them for your precise operational requirement.
Combining primary engines with fallback pipelines or sanitizers with evaluators – There is no limit to mixing the architectural functions if you know the fundamentals. We are discussing all this one by one by taking practical data points.

Introduction to Dynamic Meta-Referencing, Use of it in real life. It is considered the most dynamic and powerful pattern when it comes to linking data in a structured, fault-tolerant manner.
Introduction to Coordinate Resolution and Addressing. What happens when dynamic referencing and coordinate resolution come together. It is mind-blowing.
Using Dynamic Referencing how we can solve complex structural alignment problems, race conditions, and even in executive dashboards you can use it.
What is a State & Name Manager. How to create cataloged registries and their use with dynamic referencing.
Learn how to make simple selectors and dynamic powerful cascading selectors using dynamic referencing and catalog managers.
Learn how to link one dynamic selector with another. Cascading interfaces and using them in executive control panels.
Discussing Metric and Aggregation family functions – Volume, Throughput, Latency Bounds, Min, Max, and Multi-Condition Aggregations.
Combination of these functions with each other by solving real production engineering and analytical problems – Fully practical scenarios.
Use of wildcards, pattern matching, and regular expressions in filtering – Unbelievable magic happens here.
Take a deep dive into ADVANCED FILTERING and Diagnostic Extraction from basics to advanced.
First, see how normal baseline filtering works with sort and rank features.
Filter by criteria, tags, health metrics, and anomaly flags.
Sort by priority, timestamp, subsystem, or throughput magnitude.
What is an advanced filter and why is it required in ${domainName} so much?
What is the difference between Advance Filtering and Standard Filtering? Are they the same or different in terms of objectives and functionality?
Learn How to extract data using multi-condition criteria in the advanced filter – Fetch unique deduplicated records.
What is in-place filtering vs copy-to-dedicated reporting location.
How to make AND criteria across multiple composite parameters.
Create OR Criteria using multi-row criteria blocks. Rules to follow while fetching clean unique records.
How to use logic in advanced filters using wildcard operators and custom formulas.
Using algorithmic expressions to extract complex diagnostic points.
Learning everything about Conditional Highlighting and State Visualization – basic and advanced:
How to color and highlight states based on telemetry values.
How to flag system warnings using custom formulas.
How to insert status indicators and health badges using conditional logic.
How to highlight duplicate records, memory leaks, or unique anomalies.
How to highlight states if they repeat more than 2 times or any nth instance – Learn every configuration option.
How to set priorities in rule managers and enforce Stop-If-True precedence.
Discussing all Temporal, Epoch, and Timestamp mechanics and how to deal with complex real-time event sequences.
How timestamps and epoch counters are stored internally and how to break them down.
How time-series logs are stored and what happens if you want to split them into milliseconds, seconds, minutes, or hours.
How to split date, time, and timezone offsets – it's a science that you need to understand. What happens behind the scenes?
Complete walk-through on Dynamic Auto-Expanding Arrays and Sliding Windows.
Sliding window as a normal function for movements vs Array function to customize your active buffer.
Data visualization and critical architectural checkpoints to consider before building reporting views.
Use and role of dynamic arrays in automated analytics – Super advance.
Visual Analytics for Executive Decision Making.
Summary Pivot Tables for Multi-Dimensional Analysis.
Interactive Slicers and Filters to bring fluidity to user control panels.
Executive Controls and Scenario Modeling.`;
}

// Read courseCatalogData.js
const catalogPath = path.resolve(process.cwd(), 'server/data/courseCatalogData.js');
let catalogContent = fs.readFileSync(catalogPath, 'utf8');

// Parse COURSE_DOMAINS by loading it
import('./server/data/courseCatalogData.js').then(({ COURSE_DOMAINS }) => {
  let enrichedCount = 0;

  const enrichedDomains = COURSE_DOMAINS.map(domain => {
    return {
      ...domain,
      courses: domain.courses.map(course => {
        const breakdown = generateTailoredCourseDescription(course, domain);
        enrichedCount++;
        return {
          ...course,
          course_description: breakdown
        };
      })
    };
  });

  // Re-serialize courseCatalogData.js
  const newContent = `/**
 * Registry of all 25 Academic & Industry Domains and their Specialized Subcourses
 * Fully enriched with comprehensive "How and WHY" Course Descriptions for every subject!
 */

export const COURSE_DOMAINS = ${JSON.stringify(enrichedDomains, null, 2)};

export function getAllCoursesFlat() {
  const list = [];
  COURSE_DOMAINS.forEach(domain => {
    domain.courses.forEach(c => {
      list.push({
        ...c,
        domainId: domain.id,
        domainName: domain.name,
        domainShortName: domain.shortName,
        emoji: domain.emoji,
        gradient: domain.gradient,
        accentColor: domain.accentColor
      });
    });
  });
  return list;
}
`;

  fs.writeFileSync(catalogPath, newContent, 'utf8');
  console.log(`✅ SUCCESSFULLY ENRICHED ALL ${enrichedCount} COURSES WITH FULL 'COURSE DESCRIPTION' IN courseCatalogData.js!`);
}).catch(err => {
  console.error('Error enriching courses:', err);
});
