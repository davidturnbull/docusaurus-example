---
title: "App review process"
sidebar_label: "App review process"
path: /review-process/
---

For an app to be distributed via the [Apps Directory](https://canva.com/apps), it needs to be approved for release by a member of the Canva Apps team. The goal of this review process is to ensure that the apps we distribute are functional, delightful, and appropriate for our users.

This page provides a high-level overview of the review process. If you're left with any lingering questions, [create a support ticket](https://canvadev.atlassian.net/servicedesk/customer/portal/8) and we'll get back to you soon.

<!-- **Note:** If your app is [team-restricted](/team-restricted-apps/), the review process is a little different. For more information, refer to [Team-restricted vs. public apps](#). -->

## Draft

By default, apps are in the **Draft** state.

When an app is in the **Draft** state, you can configure, develop, and preview the app, but no one else can access it. If the app is only for your personal use, it never has to leave the **Draft** state.

<!-- Before submitting an app, it should meet the criteria in the [submission checklist](#). If the app doesn't meet _any_ of the items in the checklist, the reviewer will reject it without further review. -->

When you're ready to submit the app, you'll need to:

- Fill out the required the metadata, such as the app's title and description
- Agree to the [Canva Developer Terms](https://about.canva.com/policies/developer-terms/) and [Canva Apps Terms](https://about.canva.com/policies/apps-terms/)

These requirements are listed on the **Submit for review** page.

:::tip  
 Don't reinvent the wheel. Check out [canva.com/apps](https://canva.com/apps) to see examples of titles, descriptions, and other metadata that has passed through the review process.  
:::

## In review

If you submit an app for review, it will move to the **In review** state. While in this state, the Canva Apps team will run through a series of tests to check if the app is ready to be released.

If your app includes a [content](./content-extensions.md) or [publish extension](./publish-extensions.md), you may notice failed HTTP requests being to your app. We send these requests to check if invalid requests are properly rejected. For more information, refer to [Verifying requests](./verifying-requests.md).

<!-- **Tip:** Canva provides a range of [UX guidelines](#). If you follow these guidelines, your app is more likely get approved for release. -->

## Rejected

If the reviewer determines that the app is not ready for release, they will mark it as **Rejected** and provide you with feedback that explains:

- Why the app was rejected
- What changes you can make to get the app accepted

When an app is in the **Rejected** state, you can't modify it. To continue making changes to the app, you'll need to [create a new version](./versions.md).

:::note  
 There are many reasons an app can be rejected, so don't feel bad if it takes some time to get it over the line. We're just as excited about releasing your app as you are.  
:::

## Approved

If your app is ready for release, the reviewer will mark it as **Approved**.

When an app changes to the **Approved** state, we'll start translating the text associated with the app, such as the descriptions and error messages. This translation process is free, automatic, and ensures that your app will be available to users in 25+ locales from around the globe.

Once your app has been translated -- it shouldn't take more than 72 hours -- you'll be able to release it via the app's **Release** page.

## Released

After you release an app, it will be marked as **Released**.

When an app is in the **Released** state, it's available via the Canva Apps directory and can't be modified. To continue making changes to the app, you'll need to [create a new version](./versions.md).
