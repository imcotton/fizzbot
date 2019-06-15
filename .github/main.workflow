workflow "Check" {
  on = "push"
  resolves = "Start"
}

action "Start" {
  uses = "docker://node:12"
  needs = "Install"
  runs = "npm"
  args = "--prefix ./nodejs start"
}

action "Install" {
  uses = "docker://node:12"
  runs = "npm"
  args = "--prefix ./nodejs install"
}

