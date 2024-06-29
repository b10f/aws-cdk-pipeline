import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { PipelineAppStage } from './pipeline-app-stage';

export class AwsCdkPipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'CdkPipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('b10f/aws-cdk-pipeline', 'main'),
                commands: ['npm ci', 'npm run build', 'npx cdk synth']
            })
        });

        pipeline.addStage(new PipelineAppStage(this, 'test', {
            env: {
                account: '130693061189',
                region: 'us-east-1'
            }
        }));
    }
}
