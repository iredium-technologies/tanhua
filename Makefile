.PHONY: build deploy

REGISTRY  = iredium
PROJECT   = tanhua
VERSION   = latest
DDIR      = deploy
ODIR      = $(DDIR)/_output
DIRS      = $(shell cd deploy && ls -d */ | grep -v "_")
SERVICES ?= $(DIRS:/=)
DEFENV    = production canary sandbox
ENV      ?= $(DEFENV)

DATE       = $(shell date +'%Y%m%d-%H%M%S')
DEPLOY_TAG = deploy-$(ENV)-$(DATE)

$(ODIR):
	mkdir -p $(ODIR)

all: update dep build-dev deploy-dev

dep:
	yarn

update:
	git pull origin master

build-dev:
	$(foreach var, $(SERVICES), docker-compose -f ./deploy/$(var)/development.yml build;)

deploy-dev:
	$(foreach var, $(SERVICES), docker-compose -f ./deploy/$(var)/development.yml up;)

down-dev:
	$(foreach var, $(SERVICES), docker-compose -f ./deploy/$(var)/development.yml down --rmi local --remove-orphans;)
