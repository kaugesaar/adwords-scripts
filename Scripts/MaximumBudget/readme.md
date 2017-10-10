# Control your campaign budgets with labels 

Have this script run hourly and it will check the all-time cost of a campaign and pause those which exceed your set/spend limit. To set a spend limit to campaign, apply a label which start with **budget::** followed by the amount it can spend in total.

Example, **budget::2500** – and the script will pause the campaign as soon as\* it has spent 2500. 

<p align="center">
  <img width="555" height="491" src="https://i.imgur.com/DoxcZfH.png">
</p>

*\*it's still limited by adwords scripts only being able to run hourly, which theoraticly could make a campaign spend more than the limit you set.*