# Priorities and Cost Breakdown

The time frame guesstimates on this breakdown are conservative. I'm using long periods to be able to account for unforseen problems and also for bug fixing after users interacted with the features for a bit. The time frames cover what I consider is the necessary time to have it working well.

The features outlined in the [proposal for new funding](%Y2iyBckEhcWvxX6a1+9ELeP6wFYD80QNdhvR50V1C7E=.sha256) can be grouped as:

----

# Tier-1 Tasks

## Basic needs for feature completeness:

These are the new features, improvements, and fixes needed for Patchfox to become a viable main client. In the original proposal they are:

* Private Message Support
* Gathering Support

I guesstimate that they will take a two weeks of work.

## Wider deployment

This is all the work necessary to get the browser to ship on all the browsers that support WebExtension protocol.

This will probably take a month worth of work, mostly because Safari will be tricky.

----

# Tier-2 Tasks

These are the tasks necessary to get Patchfox working with go-ssb and the multiple identities support. The way I idealise this, they can't be implemented separately.

This will take about three months of work.

----

# Tier-3 Tasks

All of the above can be developed by running Patchwork or another ssb-server manually. In this tier, the focus would be Scuttle Shell development which would make Patchfox and other clients more independent. This is not a requirement for Patchfox work, but it can change how the ecosystem evolves and reduce friction for more client development.

This will take about two months of work.

----

# Total time allocation

* **Tier-1:** 6 weeks.
* **Tier-2:** 12 weeks.
* **Tier-3:** 8 weeks.
* **Total time:** 26 weeks (about 6 months)

The minimum amount of time would be 16 weeks if I implement only Tier-1 and Tier-2 tasks, and cut Safari from it.

# What can be cut?

Safari support and Scuttle Shell work could be cut, or reduced to low-priority. If I had to cut something, it would be Safari support because it is a niche browser. Still, I think it is important and I rather see it as some sort of _Tier-4_ task to be done last than dropped.

If we had to term something as a _stretch goal_ than I'd say Safari and Scuttle Shell are stretch goals.

# Budget

I'm calculating it as 25 GBP per hour and four hours per day, five days per week.

That would be 500 GBP per week for a total of 13.000 GBP for the full 26 weeks of work, or 8.000 GBP for the minimum amount of work detailed above.

Be aware that taxes are high in the UK and so is the cost of living in London. Taxes alone will eat a lot of that money.