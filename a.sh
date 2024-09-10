git filter-branch --env-filter '
CORRECT_NAME="mbot"
CORRECT_EMAIL="mbot@temu.com"
if [[ "$GIT_COMMITTER_EMAIL" =~ (pdd|pinduoduo) ]]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [[ "$GIT_AUTHOR_EMAIL" =~ (pdd|pinduoduo) ]]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
