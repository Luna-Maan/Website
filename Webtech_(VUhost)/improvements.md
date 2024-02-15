Pepijn deleted one of the two tables and added JS code to handle the responsiveness that was first handled by using two tables.
Form validation (JS):
- fields get prefilled if an existing ID is provided
- image URL gets tested if it leads to an image when the form is submitted (and before it gets send to the server)
- ID gets tested when the form is submitted (and before it gets send to the server)
- Error alerts before form gets send: "submitted ID 'id' not found" and "Image not found at submitted URL", these get combined to one alert if needed
- Alert as response to response status: 204: "Updated!", 201: "Created!", 404: "404: Something went wrong"

more minor feedback:
- don't show external links when printing
- no paragraph tags (<p>...</p>) are needed inside lists
- use of a:link, construct previously missing, to make links appear initially of one color and of other when already visited (a:visited)


WCAG guidelines:
- guideline 1.1: all images were provided with text alternatives and a brief footer.
- guideline 1.3: our content is presented in different formats (headings, paragraphs, tables, images and lists), and it's accesible, in its whole, from different devices no matter the screen sizes of these, which is achieved handling the responsiveness using JS.
- guideline 1.4: the website presents colors easily distinguishable, for example, by differentiating between consecutive table rows' backgrounds color or by using colors for text that clearly contrast with its background. The website is reponsive and all content is accesible and functional from different screens with different sizes (e.g the modal was made scrollable in a phone size screen)
- guideline 2.1: all our website is scrollable and all the buttons in it are accesible and possible to press, using the keyboards
- guideline 2.4: the website content is navigable and predictable. All buttons usage is clear, text in the modal is displayed for additional functionality and all the input areas are provided with text for assistance 
For the modal we used JS code from w3schools