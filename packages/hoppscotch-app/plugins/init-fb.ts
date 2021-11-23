import { initializeFirebase } from "~/helpers/fb"
import { bulkApplySettings } from "~/newstore/settings"

export default function ({ route }) {
  function applyUserSettings() {
    // const userID = 'NyyAV1YpqjWfiZX4KxgiW5wpZ3o1'
    const { userID, endpointID, embed } = route.query

    if (userID && endpointID) {
      bulkApplySettings({
        USER_SPECIFIC_MODE: true,

        EMBED_MODE: !!(embed === "true"),
        // @ts-ignore
        userID: getInitialValueFromQuery(userID),
        // @ts-ignore
        endpointID: getInitialValueFromQuery(endpointID),
      })
    }
  }

  function getInitialValueFromQuery(query: string | Array<string>): string {
    return (Array.isArray(query) ? query[0] : query) || ""
  }

  function disableSync() {
    bulkApplySettings({
      syncCollections: false,
      syncEnvironments: false,
      syncHistory: false,
    })
  }

  function isUserSpecificMode() {
    return !!route.query.userID
  }

  function loadUserSpecificSettings() {
    disableSync()
    applyUserSettings()
  }

  if (isUserSpecificMode()) loadUserSpecificSettings()

  initializeFirebase(isUserSpecificMode())
}
