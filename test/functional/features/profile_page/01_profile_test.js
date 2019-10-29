Feature('Profile Page - @smoke')

BeforeSuite(async loginPage => {
  await loginPage.deleteUser('syst_three')
  await loginPage.addUser('syst_three', '123456', ['collection:cloud_articles'])
  await loginPage.createSession('syst_three', '123456', '/profile')
})

AfterSuite(async (I, loginPage) => {
  await I.clearCookie('accessToken')
  await loginPage.deleteUser('syst_three')
})

Scenario('Change Personal Details', async profilePage => {
  await profilePage.changePersonalDetails('First', 'Last')
})

// DataTable to test different combinations of password fields
const passwords = new DataTable([
  'currentPassword',
  'newPassword',
  'confirmNewPassword'
])

passwords.add(['123456', '123456', '123455'])
passwords.add(['123456', '123457', '123456'])

Data(passwords).Scenario(
  'Invalid Passwords - Screen Error',
  async (current, profilePage) => {
    await profilePage.newPasswordsNoMatch(
      current.currentPassword,
      current.newPassword,
      current.confirmNewPassword
    )
  }
)

Scenario('Invalid Current Password - Screen Error', async profilePage => {
  await profilePage.invalidCurrentPassword('12345', '1234567', '1234567')
})

Scenario('Successful Password Change', async (loginPage, profilePage) => {
  await profilePage.successfulPasswordChange('123456', '654321', '654321')
  await loginPage.validateSignIn('syst_three', '654321')
})
