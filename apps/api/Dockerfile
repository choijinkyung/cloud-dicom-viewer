FROM node:20-bookworm-slim

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @dicom-viewer/db generate
RUN pnpm --filter @dicom-viewer/api build

EXPOSE 4000

CMD ["pnpm", "--filter", "@dicom-viewer/api", "start"]

