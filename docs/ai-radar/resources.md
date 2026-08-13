# AI Radar — Resources / Platforms

모델·워크플로우·제작자 외에, 다시 찾아볼 가치가 있는 공식 문서·워크플로우 허브·제작 도구를 기록한다.

## ComfyUI official MiniMax H3 guide
- Why useful: H3의 T2V / I2V / R2V native workflows, 필요한 model files, resolution/duration/prompt 구조를 공식 문서에서 확인 가능
- Key point: ComfyUI 0.30.0+ native support, H3 open weights, native stereo audio
- Source: https://docs.comfy.org/tutorials/video/minimax/minimax-h3

## MiniMax H3 official model
- Why useful: base capability와 최신 배포 상태 확인의 원본
- Source: https://huggingface.co/MiniMaxAI/MiniMax-H3

## LTX-2.5 official model page
- Why useful: native multishot, continuity, 4K HDR/RAW, fine-tuning 방향 확인
- Source: https://ltx.io/model/ltx-2-5

## Higgsfield Soul Cast / Cinema Studio
- Why useful: character consistency, multi-shot, emotion/camera control, 실제 production-oriented character workflow 관찰
- Production-knowledge angle: character sheet와 영화 제작 breakdown을 공개하는 사례
- Sources:
  - https://higgsfield.ai/soul-cast-intro
  - https://higgsfield.ai/blog/cinema-studio-guide

## Suno
- Why useful: 뮤직비디오 workflow의 음악 생성 upstream. 곡 concept이 캐릭터/콘티/영상의 semantic anchor가 될 수 있음
- Relevant functions: full-song generation, upload audio, voice/profile, editing/stems
- Source: https://suno.com

## ComfyStack
- Why useful: community ComfyUI workflow discovery / packaged production recipes
- Known item: MiniMax H3 3 Images + Sound to Video
- Source: https://comfystack.online

## Runpod
- Why useful: open-weight LLM/video model을 필요할 때만 GPU로 실행하는 compute plane
- Watch metric: API credit cost 대비 usable-shot cost, retry freedom, VRAM별 workflow 실행 가능성
- Source: https://www.runpod.io

## Evaluation principles captured from this conversation
- Video: 표시된 clip 가격보다 `usable shot 하나를 얻는 실제 비용`을 본다. 재생성 횟수 포함.
- Open ecosystem: stars/downloads만 보지 않고 derivative workflows, LoRAs, custom nodes, finished works, maintainer activity를 본다.
- Creative automation: 사람은 concept/emotion/character/final selection에 집중하고, AI는 routing/setup/retry/rough-cut/encode를 자동화한다.
- Long-form LLM: context window 크기와 behavioral stability를 분리해서 평가한다.
