import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
    const appEnv = process.env.APP_ENV || 'dev';

    return {
        ...config,
        name: config.name || "tech-stack-poc",
        slug: config.slug || "chart-libraries",
        extra: {
            ...config.extra,
            appEnv,
        }
    };
};
