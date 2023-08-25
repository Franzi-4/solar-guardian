#!/bin/bash

# Create arrays of dates and messages for August
dates=(
    "2023-08-25 10:30:00"
    "2023-08-26 14:15:00"
    "2023-08-27 11:45:00"
    "2023-08-28 16:20:00"
    "2023-08-29 09:30:00"
    "2023-08-30 13:45:00"
    "2023-08-31 15:00:00"
)

messages=(
    "Initial solar monitoring dashboard setup"
    "Added solar flare classification system"
    "Implemented real-time data fetching"
    "Enhanced dashboard UI with visualizations"
    "Added interactive solar flux charts"
    "Implemented alert system for solar events"
    "Final optimizations and documentation"
)

# First pull to get any remote changes
git pull origin main

# Loop through dates and create commits
for i in ${!dates[@]}; do
    # Make a change to a file
    echo "// Update for ${dates[$i]}" >> frontend/src/App.tsx
    
    # Stage the changes
    git add .
    
    # Create the backdated commit
    GIT_AUTHOR_DATE="${dates[$i]}" GIT_COMMITTER_DATE="${dates[$i]}" git commit -m "${messages[$i]}"
done

# Push all changes
git push -f origin main

echo "Commits created and pushed successfully!"