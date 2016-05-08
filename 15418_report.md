#418 Final Report

##Summary

Our project is to implement a parallel solver for a NP-complete puzzle called Shakashaka using Mozilla Developer Network (MDN) web workers. The deliverable is a web application hosted locally on the client's machine which will use the whatever processing abilities on the individual's computer. 

We aim to achieve a 2-3x speedup over the sequential version. 

##Background

There are 3 main parts:

###1) Sequential solver

The solver takes in a solvable Shakashaka board (a 2-D array of numbers) and returns a board which is solved. The algorithm first fills the deducible squares of the board (usually indicated by black squares with numbers). Then it calls the isSolve() function to check if the board is solved, otherwise it will call mayBeSolvalbe() function to check if such a board configuration can actually be solved, before calling seqSolveByGuessing(), which brute-force fills the board with all possible squares. Afterwards, it will keep repeating the process till it reaches a board configuration that isSolved() returns true. 

The algorithm runs recursively and hence all board configurations are stored on the stack which is on the RAM (unless memory overloads then it uses the hard disk, but we will not go there).  

###2) Sequential board checker 

The key part of this application relies on the checker to determine if the board is either solved or is possible to solve. 

For the isSolved( *some\_board_configuration* ), the algorithms checks the sides and corners for invalid configurations. For the inner squares, we use the validBlock() function which calculates the inner angle of a 2 by 2 sub-block. For example, let consider a 2 by 2 block of squares. We divide each square into 4 smaller triangles such as:

	\ 0 /
	1 x 3
	/ 2 \

So for each square in the 2 by 2 sub-block, we can reduce the problem into a sequence of 8 T/F values (Eg. TFFTFFFT) for each sub-block. T (true) indicates the smaller triangle is black while F (false) indicates the smaller triangle is white. Each T contributes a 45 degree angle to the sub-block. We eliminate boards with invalid angles such as 45,135,215 and so on. Only 0,90,180 and 360 angles are allowed in any solved board. So our algorithm basically calculates all angles in the sub-block and determine if each satisfies the solved board criteria.

For the mayBeSolvable( *some\_board_configuration* ), it checks if the board is even actually solvable at all (returns true if possible to solve, otherwise false). It is almost similar to the isSolved() function except now it checks each side and angle with a different set of criterions. For sides, only boards with 45 degree angles are eliminated. It will also run the same validBlock() but with a different set of checks.

###3) Parallel Workers

And the last main part involves writing a parallel worker script using a stack data structure that is used in the main thread. 

####What parts stand to gain from parallelization?


##Approach

The program is written in typescript (fancy javascript).

We use MDN web workers to achieve parallelism on the client side brower.

(All code is written from scratch)

![GitHub Logo](images/message_passing.png)

Our initial sequential solver brute force tries every possible board configuration and uses isSolve() to verify every board. Obviously, this implementation is very slow and can only solve a 3 by 3 board within a reasonable amount of time. Before we can parallelize the solver, we need to shave down number of impossible to solve configurations so that the size of our recursion tree becomes smaller. Also mapping an impossible configuration to a thread on a core will result in wasted computation.

Eg. 
// Insert impossible board configuration and display wasted tree branch.

So next we implemented a mayBeSolvable() to remove boards that can never be solved. Now a partially solved 4 by 4 board can be solved in a reasonable amount of time.

// Show sequential speedup (not neccessary)


Now to distribute the work over parallel workers.

We use the MDN web workers to statically distribute work onto the processing cores on the clients computer. We are not parallelizing over a board (since small boards already takes a long time to solve using brute force along) but instead, when running the solver algorithm, we generate a tree of board configurations. So in the first iteration of the algorithm, a tree with multiple subtrees are generated. And at the root of each subtree is a board configuration. Then we assign each subtree (or will be a subtree of configurations) to available workers in the worker pool. 

// INSERT PICTURE HERE (tree)

Each parallel worker has a **queue** to store board configurations. So while a single worker is still working on a board, any board pass from the main thread to the worker (as a message) is stored on the queue till the worker is freed from its current work. 

// Diagram explaining how task was distributed from the main thread. (static distribution)

The main threads assign a board to the least busy worker based on the number of boards on each worker's queue. This was not good since each board configuration yields a different size subtree of configurations and may not balance the workload evenly enough among the parallel workers.

So we decided to modify the Parallel Solver to remanage the distribution of work.

So instead, we put a main stack storing each board configuration in the main thread (parallel solver).

// Diagram for single stack fetch 

The main thread initially assigns possible to solve boards to available worker threads. Then all other boards will put on the main thread's stack. Once the worker has completed checking a board, it will pop another board from the main stack and repeat the process (via message passing). 

So rather than performing work in its own queue, the worker will request a new board whenever it finishes its task. 

**NOTE**: although it may seem the workers seem to be contending for the top of the stack, it actually does not. This is because the individual workers have to send a message to the main thread (parallel worker) in which the main thread distributes the work in a sequential manner. Thus no locking is required to ensure the correctness of the program. 


// Insert subtree here

Each black dot represents a board configuration.

At any point in time as the algorithm runs, the traversal of the stack tree yields a sequence of boards in a single branch - in other words, although the running time of the brute force algorithm is exponential, the amount of memory used is based on the number of nodes along the path of traversal (as shown in the diagram) so is relatively small compared to the size of the tree. Hence, there was not much locality we can exploit here since the number of memory accesses pales in comparison to the amount of computations performed by the sequential solver. And every time a branch ends (reached an invalid board configuration), all the memory is deallocated automatically. Each board configuration at each node is unique, so caching is not useful.

##Results









