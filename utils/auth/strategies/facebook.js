const passport = require("passport");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const boom = require("@hapi/boom");
const axios = require("axios");

const { config } = require("../../../config/index");

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookClientId,
      clientSecret: config.facebookClientSecret,
      callbackURL: "https://twitter.com/jonathangg_03",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const { data, status } = await axios({
          url: `${config.apiUrl}/api/auth/sign-provider`,
          method: "post",
          data: {
            name: profile.name,
            email: profile.email,
            password: profile.id,
            apiKeyToken: config.apiKeyToken,
          },
        });

        if (!data || status !== 200) {
          return done(boom.unauthorized(), false);
        }

        return done(null, data);
      } catch (error) {
        done(error);
      }
    }
  )
);
