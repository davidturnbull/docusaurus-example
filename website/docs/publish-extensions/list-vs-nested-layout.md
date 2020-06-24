---
title: "List vs. Nested layout"
path: /publish-extensions/list-vs-nested-layout/
---

This topic explains the differences between the **List** and **Nested** layouts. If you'd like a more detailed walkthrough of each layout, refer to the [List layout](./list-layout.md) and [Nested layout](./nested-layout.md) topics.

| List                                                                                                                                 | Nested                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Users must select a container before publishing their design.                                                                        | Users do not have to select a container before publishing their design.                                                                          |
| Containers cannot be nested within other containers. They're presented as a flat list.                                               | Containers can be nested within other containers. They can form deep hierarchies.                                                                |
| After the user clicks the **Save** button, Canva always sends a `POST` request to `/publish/resources/get`.                          | After the user clicks the **Save** button, Canva only sends a `POST` request to `/publish/resources/get` if the user has selected a container.   |
| When Canva sends a `POST` request to `/publish/resources/upload`, the `parent` property will always contain the `id` of a container. | When Canva sends a `POST` request to `/publish/resources/upload`, the `parent` property may be `null` (if the user hasn't selected a container). |
