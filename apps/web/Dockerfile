FROM node:20-bookworm-slim

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @dicom-viewer/web build

EXPOSE 3000

CMD ["pnpm", "--filter", "@dicom-viewer/web", "start"]

