#!/bin/bash
# deploy-setup.sh

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="preview"
DEPLOY_FLAGS=""

# Function to print usage
print_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  --prod         Set up production environment"
    echo "  -h, --help     Show this help message"
}

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --prod) ENVIRONMENT="production"; DEPLOY_FLAGS="--prod";;
        -h|--help) print_usage; exit 0;;
        *) echo "Unknown parameter: $1"; print_usage; exit 1;;
    esac
    shift
done

echo -e "${BLUE}Starting deployment setup for ${YELLOW}${ENVIRONMENT}${BLUE} environment...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

# Initial deployment
echo -e "\n${GREEN}Setting up project in Vercel...${NC}"
vercel $DEPLOY_FLAGS

# Set up environment variables
echo -e "\n${GREEN}Setting up environment variables for ${YELLOW}${ENVIRONMENT}${GREEN} environment...${NC}"
echo "Please enter values for each environment variable:"

# Read from .env.example to get variable names
while IFS= read -r line; do
    # Skip empty lines and comments
    [[ $line =~ ^[[:space:]]*$ ]] && continue
    [[ $line =~ ^# ]] && continue
    
    # Get variable name (everything before =)
    var_name=$(echo "$line" | cut -d= -f1)
    
    echo -e "\n${BLUE}Checking $var_name for ${YELLOW}${ENVIRONMENT}${BLUE}${NC}"
    # Try to get the variable, if it exists we'll get a success status
    if vercel env ls | grep -q "^$var_name"; then
        echo -e "${YELLOW}Variable $var_name already exists${NC}"
    else
        echo -e "${GREEN}Adding new variable $var_name${NC}"
        vercel env add $var_name $ENVIRONMENT
    fi
done < .env.example

echo -e "\n${GREEN}Setup complete! Your project is now deployed to ${YELLOW}${ENVIRONMENT}${GREEN}.${NC}"
if [ "$ENVIRONMENT" != "production" ]; then
    echo -e "To deploy to production in the future, run: ${BLUE}$0 --prod${NC}"
fi
