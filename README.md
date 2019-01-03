# fancy image colage



# Psuedocode ish
This is an overview off how the code is written.

### Phase 0 - setup
1. render, but hide all images / videos, make a this.myRefs array and assign it to those objects
2. shapes double array contains one shape, which consist of 4 lines forming a rectangle

### Phase 1 - making a new shape
1. Pick a random shape from shapes
2. Pick 2 random lines from that shape
3. Pick a random point on both lines => p1 & p2
4. Split the lines from 2. on p1 and p2 making 4 lines in total
5. Make a new line from p1 and p2
Now we have lines that togheter is two shapes

### Phase 2 - Extracting the two shapes
1. pick a random line L1
2. find which lines touch L1, and choose one of them. (there is a lot of edge cases here)
3. repeat process until you find a line that touches the newLine.z
Now you have found the first shape
4. Make a new shape from the lines you picked
5. Make another shape from the lines you did not pick
6. replace the original shape with one of these and append the other to shapes

### phase 3 - ordering
1. Go trough every shape in shapes
2. Pick a line in shape
3. Find the first line that touches that line
4. Order the points in that line such that L1.p2 = L2.p1
And now you have shapes with orderer lines

### phase 4 - drawing
Every image should have their corresponding shape
1. find out if the object is image or video
2. if image goto 3. if video goto 6.
3. create a pattern of the image (can't directly draw the image)
4. scale it to match the canvas
5. Draw all the lines in the shape and fill it with the pattern
6. Create a step function that is called on each video frame. That video frame is treated as an image, and such u can use the process in 3-5

### tada
success. 