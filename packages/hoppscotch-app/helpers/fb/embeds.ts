import { collection, getFirestore, onSnapshot } from "firebase/firestore"

import {
  setRESTCollections,
  translateToNewRESTCollection,
} from "~/newstore/collections"

import { replaceEnvironments } from "~/newstore/environments"

type userID = string

function initEmbeddedCollections(userID: userID): void {
  onSnapshot(
    collection(getFirestore(), "users", userID, "collections"),
    (collectionsRef) => {
      const collections: any[] = []
      collectionsRef.forEach((doc) => {
        const collection = doc.data()
        collection.id = doc.id
        collections.push(collection)
      })

      if (collections.length > 0) {
        setRESTCollections(
          (collections[0].collection ?? []).map(translateToNewRESTCollection)
        )
      }
    }
  )
}

function initEmbeddedEnvironments(userID: userID): void {
  onSnapshot(
    collection(getFirestore(), "users", userID, "environments"),
    (environmentsRef) => {
      const environments: any[] = []

      environmentsRef.forEach((doc) => {
        const environment = doc.data()
        environment.id = doc.id
        environments.push(environment)
      })

      if (environments.length > 0) {
        replaceEnvironments(environments[0].environment)
      }
    }
  )
}

export function initEmbedUserItems(userID: userID): void {
  if (!userID) return
  initEmbeddedCollections(userID)
  initEmbeddedEnvironments(userID)
}
